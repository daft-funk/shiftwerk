require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// TODO need to make sure this is the correct path for dbHelpers
const dbHelpers = require('../dbHelpers/dbHelpers.js');


const app = express();
app.use(bodyParser.json());
app.use(cors());

// const models = require('../db/index');


app.get('/', (req, res) => {
  res.send("I'm connected!");
});

// get list of shifts by term and value for werker
app.get('/shifts', (req, res) => {
  // TODO check helper function name
  dbHelpers.getShiftsBySearchTermsAndVals(req.query)
    .then((shifts) => {
      res.send(shifts);
    })
    .catch((error) => {
      console.log(error, 'error in getting shifts');
      res.status(500).send('error in getting shifts');
    });
});

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

// get profile for maker and werker
app.get('/profile', (req, res) => {
  // TODO what to put in here...?
  res.send('meow');
});

// get list of werkers by terms
app.get('/werkers', (req, res) => {
  // TODO check helper function name
  dbHelpers.getWerkersByTerm(req.query)
    .then((werkers) => {
      res.send(werkers);
    })
    .catch((error) => {
      console.log(error, 'unable to get werkers');
      res.status(500).send('unable to get werkers');
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

// create shift
app.put('/shifts', (req, res) => {
  const { name, time_date, duration, address, lat, long, payment_amnt, description, cash_rating  } = req.body;
  // TODO need to make sure im retreiving information correctly
  dbHelpers.createShift(name, time_date, duration, address, lat, long, payment_amnt, description, cash_rating)
    .then(() => {
      res.send(201);
    })
    .catch((error) => {
      console.log(error, 'unable to create shift');
      res.send(500);
    });
});

// apply for shift
app.put('/shifts/:shiftId/application', (req, res) => {
  const shiftId = JSON.parse(req.params.shiftId);
  // TODO check name of helper function
  dbHelpers.applyForShift(shiftId)
    .then(() => {
      res.send(201);
    })
    .catch((error) => {
      console.log(error, 'unable to apply');
      res.status(500).send('unable to apply');
    });
});

// accept or decline shift
app.patch('/shifts/:shiftId/application', (req, res) => {
  const shiftId = JSON.parse(req.params.shiftId);
  const { status, werkerId } = req.body;
  // NEED TO GET WERKER Id
  // need to find out if accessing status correctly
  // TODO check name of helper function
  if (status === true) {
    dbHelpers.acceptShift(shiftId, werkerId)
      .then(() => {
        res.send(204);
      })
      .catch((error) => {
        console.log(error, 'unable to accept');
        res.status(500).send('unable to accept');
      });
  } else if (status === false) {
    dbHelpers.declineShift(shiftId, werkerId)
      .then(() => {
        res.send(204);
      })
      .catch((error) => {
        console.log(error, 'unable to decline');
        res.status(500).send('unable to decline');
      });
  }
});


const port = process.env.PORT || 4000;
// models.sequelize.sync();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
