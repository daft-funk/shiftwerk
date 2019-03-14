/* creating shifts
  accepting shifts
  declining shifts
  applying to shifts
  searching
  for shifts
  searching
  for werkers
  inviting werkers to shift
  getting user profile
*/

const sequelize = require('sequelize');
const db = require('../db/index');

// function to create shifts
const createShift = (name, time_date, duration, address, lat, long, payment_amnt, description, cache_rating) => {
  return db.models.Shift.create({
    name: name, time_date: time_date, duration: duration, address: address, lat: lat, long: long, payment_amnt: payment_amnt, description: description, cache_rating: cache_rating 
  });
};

// funciton to accept shifts
const acceptShift = ()
