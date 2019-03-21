/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
// TODO need to make sure this is the correct path for dbHelpers
const dbHelpers = require('../dbHelpers/dbHelpers.js');
// const oauth2Client = new google.auth.OAuth2(
//   '347712232584-9dv95ud3ilg9bk7vg8i0biqav62fh1q7.apps.googleusercontent.com',
//   'WBbo3VF1_r9zsOovnfdi0h1Z',
// );


const app = express();
app.use(bodyParser.json());
app.use(cors());

const { models } = require('../db/index');

const errorHandler = (err, res) => {
  console.error(err);
  res.send(500, 'Something went wrong!');
};

app.get('/', (req, res) => {
  res.send("I'm connected!");
});

// // get list of shifts by term and value for werker
// app.get('/shifts', (req, res) => {
//   // TODO check helper function name
//   dbHelpers.getAllShifts()
//     .then((shifts) => {
//       res.send(shifts);
//     })
//     .catch((error) => {
//       console.log(error, 'error in getting shifts');
//       res.status(500).send('error in getting shifts');
//     });
// });

// get detailed shift info by Id for maker and werker
app.get('/shifts/:shiftId', (req, res) => {
  const shiftId = JSON.parse(req.params.shiftId);
  // TODO check helper function name
  dbHelpers.getShiftsById(shiftId)
    .then((shift) => {
      res.send(shift);
    })
    .catch((error) => {
      console.log(error, 'unable to get SHIFT');
      res.status(500).send('unable to get SHIFT!');
    });
});

// get werkers eligible for invitation to shift
app.get('/shifts/:shiftId/invite', (req, res) => {
  const { shiftId } = req.params;
  dbHelpers.getWerkersForShift(shiftId)
    .then(werkers => res.json(200, werkers))
    .catch((err) => {
      console.error(err);
      res.send(500, 'Something went wrong!');
    });
});

// get profile for werker
app.get('/werkers/:werkerId', (req, res) => {
  dbHelpers.getWerkerProfile(req.params.werkerId)
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

// get list of shifts by terms
app.get('/shifts', (req, res) => {
  // TODO check helper function name
  dbHelpers.getShiftsByTerm(req.query)
    .then((shifts) => {
      res.send(shifts);
    })
    .catch((error) => {
      console.log(error, 'unable to get shifts');
      res.status(500).send('unable to get shifts');
    });
});

app.get('/werkers/:werkerId/allShifts', (req, res) => {
  const { werkerId } = req.params;
  dbHelpers.getShiftsForWerker(werkerId)
    .then(shifts => res.json(200, shifts))
    .catch(err => errorHandler(err));
});

/**
 * PUT /werkers
 * expects body with following properties:
 *  name_first
 *  name_last
 *  email
 *  url_photo
 *  bio
 *  phone
 *  last_minute
 *  certifications[]
 *  positions[]
 * creates new resource in db
 * sends back new db record
 */

app.put('/werkers', (req, res) => {
  dbHelpers.addWerker(req.body)
    .then(newWerker => res.json(201, newWerker))
    .catch((err) => {
      console.error(err);
      res.send(500, 'Something went wrong!');
    });
});

/**
 * PUT /makers
 * expects body with the following properties:
 *  name
 *  url_photo
 *  email
 *  phone
 * creates new resource in db
 * sends back new db record
 */

app.put('/makers', (req, res) => {
  models.Maker.create(req.body)
    .then(newMaker => res.json(201, newMaker))
    .catch((err) => {
      console.error(err);
      res.send(500, 'Something went wrong!');
    });
});

app.get('/makers/:makerId', (req, res) => {
  models.Maker.findOne({ where: { id: req.params.makerId } })
    .then(maker => res.json(201, maker))
    .catch((err) => {
      console.error(err);
      res.send(500, 'Something went wrong!');
    });
});

// invite werkers
app.put('/shifts/:shiftId/invite', (req, res) => {
  const shiftId = JSON.parse(req.params.shiftId);
  // TODO need to make sure I'm retreiving information correctly
  dbHelpers.inviteWerker(shiftId, req.body)
    .then(() => {
      res.send(201);
    })
    .catch((error) => {
      console.log(error, 'unable to invite werker');
      res.send(500);
    });
});

app.put('/auth', (req, res) => {
  const { tokens } = google;
});

// create shift
/**
 * PUT /shifts
 * expects body with the following properties:
 *  MakerId
 *  name
 *  time_date
 *  duration
 *  lat
 *  long
 *  description
 *  Positions[]
 *   Position is obj with:
 *   position
 *   ShiftPosition: obj with:
 *    payment_amnt
 *  PaymentType: obj with:
 *    name
 */
app.put('/shifts', (req, res) => {
  const { body } = req;
  // TODO need to make sure im retreiving information correctly
  dbHelpers.createShift(body)
    .then(() => {
      res.send(201);
    })
    .catch((error) => {
      console.log(error, 'unable to create shift');
      res.send(500);
    });
});

// apply or invite for shift
// applyOrInvite must be string "apply" or "invite"
app.put('/shifts/:shiftId/:applyOrInvite/:werkerId/:positionName', (req, res) => {
  const { shiftId, applyOrInvite, werkerId, positionName } = req.params;
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
      res.send(204);
    })
    .catch((error) => {
      console.log(error, 'unable to accept/decline');
      res.status(500).send('unable to accept/decline');
    });
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

// get all shifts a werker is eligible for based on positions
app.get('/werkers/:werkerId/shifts/available', (req, res) => {
  const { werkerId } = req.params;
  return dbHelpers.getShiftsForWerker(werkerId)
    .then(shifts => res.json(200, shifts))
    .catch(err => errorHandler(err, res));
});

// histOrUpcoming is either 'history' or 'upcoming'
// status is 'accept'
// histOrUpcoming does not apply if status is 'invite'
app.get('/werkers/:werkerId/shifts/:histOrUpcoming', (req, res) => {
  const { werkerId, histOrUpcoming } = req.params;
  return dbHelpers.getAcceptedShifts(werkerId, histOrUpcoming)
    .then(shifts => res.json(200, shifts))
    .catch(err => errorHandler(err, res));
});

// get all shifts werker is invited to
app.get('/werkers/:werkerId/invitations', (req, res) => {
  const { werkerId } = req.params;
  return dbHelpers.getInvitedShifts(werkerId)
    .then(shifts => res.status(200).json(shifts))
    .catch(err => errorHandler(err, res));
});

// get all applications to a maker's shifts
app.get('/makers/:makerId/applications', (req, res) => {
  const { makerId } = req.params;
  return dbHelpers.getApplicationsForShifts(makerId)
    .then(shifts => res.status(200).json(shifts))
    .catch(err => errorHandler(err, res));
});

// get all unfulfilled shifts of a maker
app.get('/makers/:makerId/unfulfilled', (req, res) => {
  const { makerId } = req.params;
  return dbHelpers.getUnfulfilledShifts(makerId)
    .then(shifts => res.status(200).json(shifts))
    .catch(err => errorHandler(err, res));
});

// histOrUpcoming is either 'history' or 'upcoming'
app.get('/makers/:makerId/fulfilled/:histOrUpcoming', (req, res) => {
  const { makerId, histOrUpcoming } = req.params;
  return dbHelpers.getFulfilledShifts(makerId, histOrUpcoming)
    .then(shifts => res.status(200).json(shifts))
    .catch(err => errorHandler(err, res));
});

const port = process.env.PORT || 4000;
// models.sequelize.sync();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
