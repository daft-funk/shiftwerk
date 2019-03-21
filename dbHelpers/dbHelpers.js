/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
// const sequelize = require('sequelize');
const db = require('../db/index');

// WERKER

/**
 * attaches a found werker's certifications and positions
 *
 * @param {Object[]} werkers - Array of werker objects from SQL query
 * @returns {Promise<Object[]>} - Modified input array
 */

const appendCertsAndPositionsToWerkers = werkers => Promise.all(werkers.map(werker => db.sequelize.query(`
      SELECT c.*, wc.*
      FROM "Certifications" c
      INNER JOIN "WerkerCertifications" wc
      ON c.id=wc."CertificationId"
      INNER JOIN "Werkers" w
      ON w.id=wc."WerkerId"
      WHERE w.id=?`, { replacements: [werker.id] })
  .then(certifications => Object.assign(werker, { certifications: certifications[0] }))
  .then(werkerWithCerts => db.sequelize.query(`
      SELECT p.position
      FROM "Positions" p
      INNER JOIN "WerkerPosition" wp
      ON p.id=wp."PositionId"
      INNER JOIN "Werkers" w
      ON w.id=wp."WerkerId"
      WHERE w.id=?`, { replacements: [werkerWithCerts.id] })
    .then(positions => Object.assign(werkerWithCerts, { positions: positions[0] })))));

/**
 * adds any number of certifications to a werker
 *
 * @param {Object} werker - werker model instance
 * @param {Object[]} certifications
 * @param {string} certifications.name
 * @param {string} certifications.url_photo
 */
const bulkAddCertificationToWerker = (werker, certifications) => Promise.all(certifications
  .map(certification => db.models.Certification.upsert(certification, { returning: true })
    // eslint-disable-next-line no-unused-vars
    .then(([newCert, updated]) => db.models.WerkerCertification.upsert({
      WerkerId: werker.id,
      CertificationId: newCert.id,
      url_Photo: certification.url_Photo,
    }, {
      returning: true,
    }))));

/**
 * adds any number of new positions to db and werker
 *
 * @param {Object} werker - werker model instance
 * @param {Object[]} positions
 * @param {string} positions.position
 */
const bulkAddPositionToWerker = (werker, positions) => Promise.all(positions
  .map(position => db.models.Position.upsert(position, { returning: true })
    // eslint-disable-next-line no-unused-vars
    .then(([newPosition, updated]) => newPosition.addWerker(werker))));

/**
 * adds new werker to DB, including certifications and positions
 *
 * @param {Object} info
 * @param {string} info.name_first
 * @param {string} info.name_last
 * @param {string} info.email
 * @param {string} info.url_photo
 * @param {string} info.bio
 * @param {number} info.phone
 * @param {boolean} info.last_minute
 * @param {Object[]} info.certifications
 * @param {string} info.certifications.cert_name
 * @param {string} info.certifications.url_Photo
 * @param {Object[]} info.positions
 * @param {string} info.positions.position
 */
const addWerker = info => db.models.Werker.upsert(info, { returning: true })
  .then(([newWerker, updated]) => bulkAddCertificationToWerker(newWerker, info.certifications)
    .then(() => bulkAddPositionToWerker(newWerker, info.positions)));

/**
 * Function to search for shifts by various terms
 *
 * @param {object} terms - an object with search terms
 * @param {string} terms.position - required position
 * @param {number} terms.proximity - maximum distance, in miles
 * @param {number} terms.payment_amnt - minimum pay to accept
 * @param {string} terms.payment_type - payment type to restrict results to
 */
const getShiftsByTerm = async (terms) => {
  const searchTerms = terms;
  if (terms.position) {
    const position = await db.models.Position.findOne({
      where: {
        position: terms.position,
      },
    });
    searchTerms.position = position.dataValues.id;
    console.log(searchTerms);
  }
  const conditions = {
    position: terms.position ? `sp."PositionId" = ${terms.position}` : 'sp."PositionId" IS NOT NULL',
    // proximity is future magic
    payment_amnt: terms.payment_amnt ? `sp.payment_amnt >= ${terms.payment_amnt}` : 'sp.payment_amnt IS NOT NULL',
    payment_type: terms.payment_type ? `s.payment_type = ${terms.payment_type}` : 's.payment_type IS NOT NULL',
  };
  return db.sequelize.query(`
  SELECT * FROM "Shifts" s
  INNER JOIN "ShiftPositions" sp
  ON s.id=sp."ShiftId"
  INNER JOIN "Positions" p
  ON p.id=sp."PositionId"
  WHERE ${conditions.position} AND ${conditions.payment_amnt} AND ${conditions.payment_type} AND sp.filled=false`)
    .then(([shifts, metadata]) => shifts);
};

/**
 * gets all werkers eligible for a shift by their listed positions
 * executes raw SQL query for convenience (sometimes it's just easier!)
 *
 * @param {number} id - shift ID from db
 * @returns {Promise<Object[]>} - array containing array of obj results
 * and object describing query
 */
const getWerkersForShift = id => db.sequelize.query(`
SELECT w.*
FROM "Werkers" w
INNER JOIN "WerkerPosition" wp
  ON w.id=wp."WerkerId"
INNER JOIN "Positions" p
  ON p.id=wp."PositionId"
INNER JOIN "ShiftPositions" sp
  ON p.id=sp."PositionId"
WHERE sp."ShiftId"=?`, { replacements: [id] })
  .then(([fetchedWerkers, metadata]) => appendCertsAndPositionsToWerkers(fetchedWerkers));

/**
 * gets all werkers with a specific position
 * executes raw SQL query for convenience (sometimes it's just easier!)
 *
 * @param {string} position - the position name by which to search
 */

const getWerkersByPosition = position => db.sequelize.query(`
  SELECT w.*
    FROM "Werkers" w
  INNER JOIN "WerkerPosition" wp
    ON w.id=wp."WerkerId"
  INNER JOIN "Positions" p
    ON p.id=wp."PositionId"
  WHERE p.position=?`, { replacements: [position] })
  .then(([fetchedWerkers, metadata]) => appendCertsAndPositionsToWerkers(fetchedWerkers));

/**
 * Function to invite a werker to a shift - creates a new invitation
 * @param {number} shiftId - the id of the shift that the werker will be invited to
 * @param {object} data - the data needed to create the new invitation
 */
const inviteWerker = (shiftId, data) => db.models.InviteApply.create({
  idWerker: data.idWerker,
  idShift: shiftId,
  idPosition: data.idPosition,
  status: data.status,
  expiration: data.expiration,
  type: data.type,
});

/**
 * Function to get a user profile
 * @param {object} data - object containing the user's id
 */
const getWerkerProfile = id => db.models.Werker.findOne({
  where: { id },
  include: [
    {
      model: db.models.Certification,
      attributes: [
        'cert_name',
      ],
    },
    {
      model: db.models.Position,
      attributes: [
        'position',
      ],
    },
  ],
});

// SHIFT

/**
 * Adds an array of items to Positions table or updates if they exist
 * @param {Object} positions - key: position, val: string, key: payment_amnt, val: Number
 */
const bulkAddNewPositionsToShift = (shift, positions) => Promise.all(positions
  .map(position => db.models.Position.upsert(position, { returning: true })
    .then(([newPosition, updated]) => db.models.ShiftPosition.upsert({
      ShiftId: shift.id,
      PositionId: newPosition.id,
      payment_amnt: position.payment_amnt,
    }, {
      returning: true,
    }))));
/**
 * Function used to create a new shift
 * @param {string} name - the name of the shift
 * @param {date} time_date - the time and date of the shift
 * @param {number} duration - the duration of the shift in minutes
 * @param {number} lat - the latitude of the shift
 * @param {number} long - the longitude of the shift
 * @param {string} description - a short description of the shift
 * @param {Array<object>} positions - has properties "position" and "payment_amnt"
 * @param {string} payment_type - what format the pay is in, e.g. cash, digital, check
 */
const createShift = ({
  MakerId,
  name,
  time_date,
  duration,
  lat,
  long,
  description,
  positions,
  payment_type,
}) => db.models.Shift.create({
  MakerId,
  name,
  time_date,
  duration,
  lat,
  long,
  description,
  payment_type,
})
  .then(newShift => bulkAddNewPositionsToShift(newShift, positions));

/**
 * Function used to apply for a shift - updates the shift status to 'Pending'
 *
 * @param {number} shiftId - the id of the shift to be applied to
 * @param {number} werkerId - the id of the werker applying or being invited to the shift
 * @param {number} positionName - the name of the position applied or invited to
 * @param {string} inviteOrApply - either "invite" or "apply" signifying
 * invitation from maker or application from werker
 */

const applyOrInviteForShift = (shiftId, werkerId, positionName, inviteOrApply) => db.sequelize.query(`
SELECT id FROM "Positions" WHERE position='${positionName}'`)
  .then(([position, metadata]) => db.sequelize.query(`
INSERT INTO "InviteApplies" ("WerkerId",
"ShiftPositionShiftId", 
"ShiftPositionPositionId", 
"createdAt", 
"updatedAt", 
"type") VALUES (${werkerId}, ${shiftId}, ${position[0].id}, 'now', 'now', '${inviteOrApply}')`));

/**
 * Function used to accept shifts - updates the shift status to 'accept' or 'decline'
 * @param {number} shiftId - the id of the shift to be accepted
 * @param {number} werkerId - the id of the werker accepting the shift
 */
const acceptOrDeclineShift = (shiftId, werkerId, status) => db.models.InviteApply.update({
  status,
}, {
  where: {
    ShiftPositionShiftId: shiftId,
    WerkerId: werkerId,
  },
  returning: true,
}).then((updated) => {
  const updatedEntry = updated[1][0].dataValues;
  if (status === 'decline') {
    return updatedEntry;
  }
  return db.sequelize.query(`
  UPDATE "ShiftPositions" sp
  SET filled=true
  WHERE sp."ShiftId"=${updatedEntry.ShiftPositionShiftId} AND sp."PositionId"=${updatedEntry.ShiftPositionPositionId}`)
    .then(([updatedShiftPosition, metadata]) => updatedShiftPosition);
});

/**
 * Function to search for shifts by keywords
 * @param {object} data - an object with search terms
 */
const getShiftsBySearchTermsAndVals = data => db.models.ShiftPosition.find({
  where: { id: data.PositionId, payment_amnt: data.payment_amnt },
  include: [db.models.Shift, db.models.Position],
});

/**
 * Function to get a shift by it's id
 * @param {number} shiftId - id of the shift to be found
 */
const getShiftsById = shiftId => db.models.Shift.findOne({
  where: {
    id: shiftId,
  },
});

/**
 * gets ten shifts from the DB, sorted by time_date
 * and offset by a given amount
 *
 * @param {Number} offset - number of pages (by ten) to offset entries by
 *
 * @returns {Promise<any[]>} - array of ten sequelize model instances
 */
const getAllShifts = (offset = 0) => db.models.Shift.findAll({
  limit: 10,
  offset: offset * 10,
  order: [['time_date', 'DESC']],
  include: [
    {
      model: db.models.Maker,
      attributes: [
        'name',
      ],
    },
    {
      model: db.models.Position,
      through: {
        attributes: [
          'payment_amnt',
          'position',
          'filled',
        ],
      },
    },
    {
      model: db.models.Werker,
      through: {
        attributes: [
          'id',
          'name',
        ],
      },
    },
  ],
});

/**
 * appends maker info to any number of shifts
 *
 * @param {Object[]} shifts - Shift instances from DB
 */
const appendMakerToShifts = shifts => Promise.all(shifts.map(shift => db.sequelize.query(`
  SELECT m.* from "Makers" m, "Shifts" s
  WHERE m.id=s."MakerId"`)
  .then(maker => Object.assign(shift, { maker: maker[0] }))));

/**
 * fetches all shifts werker is eligible for based on positions
 *
 * @param {number} id - the werker ID from DB
 */
const getShiftsForWerker = id => db.sequelize.query(`
SELECT s.*
FROM "Shifts" s
INNER JOIN "ShiftPositions" sp
  ON s.id=sp."ShiftId"
INNER JOIN "Positions" p
  ON p.id=sp."PositionId"
INNER JOIN "WerkerPosition" wp
  ON p.id=wp."PositionId"
INNER JOIN "Werkers" w
  ON w.id=wp."WerkerId"
WHERE w.id=?`, { replacements: [id] })
  .then((queryResult) => {
    const fetchedShifts = queryResult[0];
    return appendMakerToShifts(fetchedShifts);
  });

/**
 * deletes a shift from the database by id
 *
 * @param {number} id
 * @returns {Promise<number>} - number of models destroyed
 */
const deleteShift = id => db.models.Shift.destroy({
  where: { id },
});

/**
 * gets all shifts a werker has been invited to with status 'pending'
 *
 * @param {number} id - ID of werker fro DB
 */
const getInvitedShifts = id => db.sequelize.query(`
SELECT * FROM "Shifts" s
INNER JOIN "ShiftPositions" sp
ON s.id = sp."ShiftId"
INNER JOIN "InviteApplies" ia
ON sp. "ShiftId" = ia."ShiftPositionShiftId" AND sp."PositionId" = ia."ShiftPositionPositionId"
INNER JOIN "Werkers" w
<<<<<<< HEAD
ON w.id=ia."WerkerId"
WHERE w.id=? AND ia.status=? AND ia.type=?`, { replacements: [id, status, type] })
  .then(([fetchedShifts, metadata]) => appendMakerToShifts(fetchedShifts));
=======
ON w.id = ia."WerkerId"
WHERE ia.type='invite' AND w.id=${id} AND ia.status='pending'`)
  .then(([shifts, metadata]) => shifts);

/**
 * gets all shifts a werker has accepted, either past or future
 *
 * @param {number} id - werker id from DB
 * @param {string} histOrUpcoming - either 'history' or 'upcoming'
 * @returns {Promise<Object[]>} - An array of Shift objects
 */

const getAcceptedShifts = (id, histOrUpcoming) => {
  const option = histOrUpcoming === 'history'
    ? '<'
    : '>';
  return db.sequelize.query(`
  SELECT * FROM "Shifts" s
  INNER JOIN "ShiftPositions" sp
  ON s.id=sp."ShiftId"
  INNER JOIN "InviteApplies" ia
  ON sp."ShiftId"=ia."ShiftPositionShiftId" AND sp."PositionId"=ia."ShiftPositionPositionId"
  INNER JOIN "Werkers" w
  ON w.id=ia."WerkerId"
  WHERE w.id=? AND s.time_date ${option} 'now'`, { replacements: [id] })
    .then(queryResult => {
      const fetchedShifts = queryResult[0];
      return appendMakerToShifts(fetchedShifts);
    });
};
>>>>>>> dbc7fde67fdcd0f1fd30cd8d1844724a252f044d

/**
 * receives werker and shift info for every pending application
 *
 * @param {number} id - maker ID from DB
 */

const getApplicationsForShifts = id => db.sequelize.query(`
SELECT w.*, s.* FROM "Werkers" w
INNER JOIN "InviteApplies" ia
ON w.id=ia."WerkerId"
INNER JOIN "ShiftPositions" sp
ON sp."ShiftId"=ia."ShiftPositionShiftId AND sp."PositionId"=ia."ShiftPositionPositionId"
INNER JOIN "Shifts" s
ON s.id=sp."ShiftId"
INNER JOIN "Makers" m
ON m.id=s."MakerId"
WHERE ia.status = 'pending' AND ia.type = 'applied' AND m.id=?`,
{ replacements: [id] })
  .then(([fetchedShiftsAndWerkers, metadata]) => fetchedShiftsAndWerkers);

/**
 * Gets all shifts that have some unfilled positions for a maker
 *
 * @param {number} id - maker ID from DB
 */

const getUnfulfilledShifts = id => db.sequelize.query(`
SELECT DISTINCT s.* FROM "Shifts" s
INNER JOIN "ShiftPositions" sp
ON s.id=sp."ShiftId"
WHERE sp.filled=false AND s."MakerId"=?`, { replacements: [id] })
  .then(([fetchedShifts, metadata]) => fetchedShifts);

/**
 * Gets all shifts that have no unfilled positions for a maker
 *
 * @param {number} id - maker ID from DB
 */

<<<<<<< HEAD
const getFulfilledShifts = id => db.sequelize.query(`
SELECT DISTINCT s.* FROM "Shifts" s
INNER JOIN "ShiftPositions" sp
ON s.id=sp."ShiftId" AND (sp.filled=false) IS NOT TRUE
WHERE s."MakerId"=?`, { replacements: [id] })
  .then(([fetchedShifts, metadata]) => fetchedShifts);
=======
const getFulfilledShifts = (id, histOrUpcoming) => {
  const option = histOrUpcoming === 'history'
    ? '<'
    : '>';
  return db.sequelize.query(`
  SELECT DISTINCT s.* FROM "Shifts" s
  INNER JOIN "ShiftPositions" sp
  ON s.id=sp."ShiftId" AND (sp.filled=false) IS NOT TRUE
  WHERE s."MakerId"=? AND s.time_date ${option} 'now'`, { replacements: [id] })
    .then(queryResult => queryResult[0]);
};
>>>>>>> dbc7fde67fdcd0f1fd30cd8d1844724a252f044d

module.exports = {
  getWerkerProfile,
  inviteWerker,
  getShiftsByTerm,
  getShiftsBySearchTermsAndVals,
  acceptOrDeclineShift,
  createShift,
  applyOrInviteForShift,
  getShiftsById,
  getAllShifts,
  deleteShift,
  bulkAddNewPositionsToShift,
  addWerker,
  bulkAddCertificationToWerker,
  bulkAddPositionToWerker,
  getWerkersForShift,
  getWerkersByPosition,
  getShiftsForWerker,
  getAcceptedShifts,
  getInvitedShifts,
  getApplicationsForShifts,
  getUnfulfilledShifts,
  getFulfilledShifts,
};
