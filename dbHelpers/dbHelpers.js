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
const getShiftBySearchTermsAndVals = (data) => {
  return db.models.findAll({
    includes: [{
      model: "Position",
      where: { position: data.position },
    }, {
      model: "Shift",
      where: {
        duration: data.duration,
        payment_amnt: data.payment_amnt,
      },
    }],
  });
};

// function to search for werkers
const getWerkersByTerm = (data) => {
  return db.models.Werker.find({
    where: {
      position: data.position,
    },
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
  getShiftBySearchTermsAndVals,
  declineShift,
  acceptShift,
  createShift,
  applyForShift,
  getShiftsById,
};
