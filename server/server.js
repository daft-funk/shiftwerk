/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const dbHelpers = require('../dbHelpers/dbHelpers.js');
const { loginFlow, checkLogin, checkUser, oauth2Client } = require('../auth/auth');
const { addToCalendar } = require('../apiHelpers/google');
const { geocode, reverseGeocode } = require('../apiHelpers/tomtom');
const { models } = require('../db/index');
const twilio = require('../apiHelpers/twilio');

const capitalize = string => string[0].toUppercase().concat(string.slice(1).toLowercase());

const errorHandler = (err, res) => {
  console.error(err);
  return res.send(500, 'Something went wrong!');
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/login', (req, res) => {
  const { code, type, device } = req.query;
  return loginFlow(code, type, device)
    .then((token) => {
      if (token) {
        console.log(token);
        return res.status(201).send(token);
      }
      throw new Error('Something went wrong validating your credentials!');
    })
    .catch(err => res.status(500).send(err));
});

// NEED A VALID TOKEN BEYOND HERE //

app.use(checkLogin);

app.get('/user', (req, res) => {
  if (req.user.type === 'werker') {
    return dbHelpers.getWerkerProfile(req.user.id)
      .then(werker => {
        if (werker.dataValues.lat) {
          return reverseGeocode(werker.dataValues.lat, werker.dataValues.long)
            .then(address => Object.assign(werker, {
              dataValues: Object.assign(werker.dataValues, {
                address,
              }),
            }));
        }
        return new Promise(resolve => resolve(werker));
      })
      .then(werker => res.json(200, werker))
      .catch(err => errorHandler(err));
  }
  return models.Maker.findById(req.user.id)
    .then(maker => res.status(200).json(maker))
    .catch(err => errorHandler(err));
});

app.patch('/user', (req, res) => {
  return dbHelpers[`update${capitalize(req.user.type)}`](req.body)
    .then(() => res.status(204).send())
    .catch(err => errorHandler(err, res));
});

/**
 * @todo sign user out of google
 */
app.delete('/user', (req, res) => {
  return dbHelpers.models[capitalize(req.user.type)].destroy({
    where: {
      id: req.user.id,
    },
  })
    .then(() => res.status(204).send())
    .catch(err => errorHandler(err));
});

// get profile for werker
app.get('/werkers/:werkerId', (req, res) => {
  return dbHelpers.getWerkerProfile(req.params.werkerId)
    .then((profile) => {
      console.log(profile);
      if (profile.dataValues.lat) {
        return reverseGeocode(profile.dataValues.lat, profile.dataValues.long)
          .then(address => Object.assign(profile, {
            dataValues: Object.assign(profile.dataValues, {
              address,
            }),
          }));
      }
      return new Promise(resolve => resolve(profile));
    })
    .then(profile => res.json(200, profile))
    .catch((err) => {
      console.error(err);
      res.send(500, 'something went wrong!');
    });
});

// get werkers by position
app.get('/werkers/search/:positionName', (req, res) => {
  dbHelpers.getWerkersByPosition(req.params.positionName)
    .then(werkers => res.json(200, werkers))
    .catch((err) => {
      console.error(err);
      res.send(500, 'something went wrong!');
    });
});

// get a maker's profile
app.get('/makers/:makerId', (req, res) => {
  models.Maker.findOne({ where: { id: req.params.makerId } })
    .then(maker => res.json(201, maker))
    .catch((err) => {
      console.error(err);
      res.send(500, 'Something went wrong!');
    });
});

// used for getting all shifts for testing or searching by terms
app.get('/shifts', (req, res) => {
  if (!req.query || req.user.type === 'maker') {
    return dbHelpers.getAllShifts()
      .then(shifts => res.status(200).json(shifts))
      .catch(err => res.status(500).send(err));
  }
  return dbHelpers.getShiftsByTerm(req.query, req.user.id)
    .then(shifts => res.status(200).json(shifts))
    .catch(err => res.status(500).send(err));
});

// get detailed shift info by Id for maker and werker
app.get('/shifts/:shiftId', async (req, res) => {
  const { shiftId } = req.params;
  // TODO check helper function name
  const shift = await dbHelpers.getShiftsById(shiftId).catch(err => errorHandler(err, res));
  return res.status(200).json(shift);
});

/**
 * PUT /shifts
 * expects body with the following properties:
 *  name
 *  start
 *  end
 *  address
 *  description
 *  positions[]
 *   position is obj with:
 *   position
 *   payment_amnt
 *   payment_type
 */
app.put('/shifts', (req, res) => {
  const { body } = req;
  body.positions = body.positions.map((position) => {
    const digit = /\d/.exec(Object.keys(position)[1])[0];
    console.log(digit);
    return {
      position: position[`position${digit}`],
      payment_amnt: position[`payment_amnt${digit}`],
      payment_type: position[`payment_type${digit}`],
    };
  });
  return geocode(body.address)
    .then(({ lat, lon }) => {
      body.lat = lat;
      body.long = lon;
      return reverseGeocode(lat, lon);
    })
    .then((address) => {
      body.address = address;
      return dbHelpers.createShift(Object.assign(body, { MakerId: req.user.id }));
    })
    .then(() => addToCalendar(
      req.user.accessToken,
      req.user.refreshToken,
      body,
      oauth2Client,
    ))
    .then(shift => res.status(201).json(shift))
    .catch(err => errorHandler(err));
});

app.patch('/shifts/:shiftId', (req, res) => {
  res.status(501).send();
});

app.delete('/shifts/:shiftId', (req, res) => {
  const { shiftId } = req.params;
  return dbHelpers.deleteShift(shiftId)
    .then(() => res.send(204))
    .catch((err) => {
      console.error(err);
      res.status(500).send('unable to delete');
    });
});

// query expects key of "shifts"
app.get('/user/shifts', (req, res) => {
  const { query } = req;
  let dbMethod = '';
  let additionalArgument = '';
  if (req.user.type === 'werker') {
    if (query.shifts === 'upcoming' || query.shifts === 'history') {
      dbMethod = 'getAcceptedShifts';
      additionalArgument = query.shifts;
    } else if (query.shifts === 'invite') {
      dbMethod = 'getInvitedShifts';
    } else if (query.shifts === 'available') {
      dbMethod = 'getAvailableShifts';
    } else {
      return res.status(400).send('Bad query string');
    }
  } else {
    if (query.shifts === 'upcoming' || query.shifts === 'history') {
      dbMethod = 'getFulfilledShifts';
      additionalArgument = query.shifts;
    } else if (query.shifts === 'apply') {
      dbMethod = 'getApplicationsForShifts';
    } else if (query.shifts === 'unfulfilled') {
      dbMethod = 'getUnfulfilledShifts';
    } else {
      return res.status(400).send('Bad query string');
    }
  }
  return dbHelpers[dbMethod](req.user.id, additionalArgument)
    .then(shifts => res.status(200).json(shifts))
    .catch(err => errorHandler(err));
});

app.get('/favorites', (req, res) => {
  const { id, type } = req.user;
  return dbHelpers.getFavorites(id, type)
    .then(faves => res.status(200).json(faves))
    .catch(err => errorHandler(err, res));
});

app.put('/favorites', (req, res) => {
  const { targetId } = req.body;
  const { type, id } = req.user;
  if (type === 'maker') {
    return dbHelpers.addFavorite(id, targetId, type)
      .then(fave => res.status(201).json(fave))
      .catch(err => errorHandler(err, res));
  }
  return dbHelpers.addFavorite(targetId, id, type)
    .then(fave => res.status(201).json(fave))
    .catch(err => errorHandler(err, res));
});

app.delete('/favorites', (req, res) => {
  const { targetId } = req.body;
  const { type, id } = req.user;
  if (type === 'maker') {
    return dbHelpers.deleteFavorite(id, targetId, type)
      .then(deleted => res.status(201).json(deleted))
      .catch(err => errorHandler(err, res));
  }
  return dbHelpers.deleteFavorite(targetId, id, type)
    .then(deleted => res.status(201).json(deleted))
    .catch(err => errorHandler(err, res));
});

// apply or invite for shift
// applyOrInvite must be string "apply" or "invite"
app.put('/shifts/:shiftId/:applyOrInvite/:werkerId/:positionName', (req, res) => {
  const {
    shiftId,
    applyOrInvite,
    werkerId,
    positionName,
  } = req.params;
  dbHelpers.applyOrInviteForShift(shiftId, werkerId, positionName, applyOrInvite)
    .then(() => {
      res.send(201);
    })
    .catch((error) => {
      console.log(error, 'unable to apply');
      res.status(500).send('unable to apply');
    });
});

// accept or decline shift
app.patch('/shifts/:shiftId/application/:werkerId/:status', (req, res) => {
  const { shiftId, werkerId, status } = req.params;
  dbHelpers.acceptOrDeclineShift(shiftId, werkerId, status)
    .then(() => {
      if (status === 'accept') {
        return Promise.all([models.Werker.findByPk(werkerId), models.Shift.findByPk(shiftId)])
          .then(([werker, shift]) => addToCalendar(
            werker.access_token,
            werker.refresh_token,
            shift,
            oauth2Client,
          ))
          .then(() => res.send(204));
      }
      return res.send(204);
    })
    .catch((error) => {
      console.log(error, 'unable to accept/decline');
      res.status(500).send('unable to accept/decline');
    });
});

app.put('/shifts/:shiftId/:werkerId/rating/:type/:rating', (req, res) => {
  const {
    shiftId,
    werkerId,
    rating,
    type,
  } = req.params;
  return dbHelpers.rateShift(shiftId, werkerId, rating, type)
    .then(newRating => res.send(201, newRating))
    .catch(err => errorHandler(err, res));
});

/**
 * sends a text to all werkers on a shift
 * body expects:
 *  shiftId
 *  message
 */
app.put('/text', (req, res) => {
  const { shiftId, message } = req.body;
  return dbHelpers.getAllWerkersOnShift(shiftId)
    .then((werkers) => {
      const numbers = werkers.filter(werker => werker.phone).map(werker => werker.phone);
      if (numbers.length) {
        // pass along a boolean - true if all werkers have a number, false if not
        return Promise.all([twilio.massText(message, numbers), numbers.length === werkers.length];
      }
      return res.status(500).send('None of the werkers have a registered phone number.');
    })
    .then(([notification, allWerkersHaveNumber]) => {
      if (allWerkersHaveNumber) {
        return res.status(201).json({ sid: notification.sid });
      }
      return res.status(201).json({sid: notification.sid, warning: 'Not all werkers have a registered phone number.' });
    })
    .catch(err => errorHandler(err, res));
});

const port = process.env.PORT || 4000;
// models.sequelize.sync();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
