const sequelize = require('sequelize');
const db = require('../db/index');

// function to create shifts
const createShift = (data) => {
  return db.models.Shift.create({
    name: data.name, time_date: data.time_date, duration: data.duration, address: data.address, lat: data.lat, long: data.long, payment_amnt: data.payment_amnt, description: data.description, cache_rating: data.cache_rating,
  });
};

// function to accept shifts
const acceptShift = (data) => {
  return db.models.InviteApply.update({
    status: 'Accepted',
  }, {
    where: {
      wekerId: data.werkerId,
      shiftId: data.shiftId,
    },
  });
};

// function to decline shifts
const declineShift = (data) => {
  return db.models.InviteApply.update({
    status: 'Declined',
  }, {
    where: {
      werkerId: data.werkerId,
      shiftId: data.shiftId,
    },
  });
};

// function to search for shifts
const shiftSearch = (data) => {
  return db.models.findAll({
    includes: [{
      model: Position,
      where: { position: data.position },
    }, {
      model: Shift,
      where: {
        duration: data.duration,
        payment_amnt: data.payment_amnt,
      },
    }],
  });
};

// function to search for werkers
const werkerSearch = (data) => {
  return db.models.Werker.findOne({
    where: {
      position: data.position,
    },
  });
};

// function to invite werkers to a shift
const inviteWerkers = (data) => {
  return db.models.InviteApply.create({
    idWerker: data.idWerker, idShift: data.idWerker, idPosition: data.idPosition, status: data.status, expiration: data.expiration, type: data.type,
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
