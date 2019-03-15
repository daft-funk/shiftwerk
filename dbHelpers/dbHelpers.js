const sequelize = require('sequelize');
const db = require('../db/index');

// function to create shifts
const createShift = (name, time_date, duration, address, lat, long, payment_amnt, description, cache_rating) => {
  return db.models.Shift.create({
    name, time_date, duration, address, lat, long, payment_amnt, description, cache_rating,
  });
};

// function to apply to shifts
const applyForShift = (shiftId, werkerId) => {
  return db.models.InviteApply.update({
    status: 'Pending',
    where: {
      shiftId,
      werkerId,
    },
  });
};

// function to accept shifts
const acceptShift = (shiftId, werkerId) => {
  return db.models.InviteApply.update({
    status: 'Accepted',
  }, {
    where: {
      shiftId,
      werkerId,
    },
  });
};

// function to decline shifts
const declineShift = (shiftId, werkerId) => {
  return db.models.InviteApply.update({
    status: 'Declined',
  }, {
    where: {
      shiftId,
      werkerId,
    },
  });
};

// function to search for shifts
const getShiftsBySearchTermsAndVals = (data) => {
  return db.models.ShiftPosition.find({
    where: { id: data.PositionId, payment_amnt: data.payment_amnt },
    include: [db.models.Shift, db.models.Position],
  });
};

// function to search for werkers
const getWerkersByTerm = (data) => {
  return db.models.Werker.find({
    where: { id: data.PositionId },
    include: [db.models.Position],
  });
};

// function to invite werkers to a shift
const inviteWerker = (shiftId, data) => {
  return db.models.InviteApply.create({
    idWerker: data.idWerker, idShift: shiftId, idPosition: data.idPosition, status: data.status, expiration: data.expiration, type: data.type,
  });
};

// function to get a user profile
const getProfile = (data) => {
  return db.models.Werker.findOne({
    where: {
      id: data.id,
    },
  });
};

// function to get a shift by ID
const getShiftsById = (shiftId) => {
  return db.models.Shift.findOne({
    where: {
      id: shiftId,
    },
  });
};

module.exports = {
  getProfile,
  inviteWerker,
  getWerkersByTerm,
  getShiftsBySearchTermsAndVals,
  declineShift,
  acceptShift,
  createShift,
  applyForShift,
  getShiftsById,
};
