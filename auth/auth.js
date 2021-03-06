/* eslint-disable camelcase */
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const { getGoogleProfile, saveGoogleProfile } = require('../apiHelpers/google');
const { models } = require('../db');
const { getMakerByShiftId } = require('../dbHelpers/dbHelpers');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage',
);

const getToken = (code, deviceType) => {
  if (deviceType === 'mobile') {
    oauth2Client.redirectUri = '';
  } else {
    oauth2Client.redirectUri = 'postmessage';
  }
  return oauth2Client.getToken(code)
    .then((tokenRes) => {
      console.log(tokenRes.tokens);
      return tokenRes.tokens;
    }).catch(err => console.error(err));
};

const getIdentity = (tokens) => {
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    id_token: tokens.id_token,
  });
  return oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
    .then(ticket => ticket.getPayload())
    .catch(err => console.error(err));
};

const generateToken = (user, type) => {
  const accessToken = jwt.sign({ id: user.id, type }, process.env.SUPER_SECRET_KEY, {
    expiresIn: '25 years',
  });
  return accessToken;
};

/**
 * handles the Google login flow in one place
 *
 * @param {string} code - code generated by Google, redeemable for a JWT
 * @param {string} type - either 'werker' or 'maker'
 */
const loginFlow = (code, type, deviceType) => getToken(code, deviceType)
  .then(token => getIdentity(token))
  .then(payload => getGoogleProfile(payload, type, oauth2Client))
  .then(user => saveGoogleProfile(user, type))
  .then(savedUser => generateToken(savedUser, type))
  .catch(err => console.error(err));

const checkLogin = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  const { id, type } = jwt.verify(token, process.env.SUPER_SECRET_KEY);
  const model = type === 'werker' ? 'Werker' : 'Maker';
  return models[model].findOne({
    where: {
      id,
    },
  }).then((user) => {
    req.user = {
      accessToken: user.access_token,
      refreshToken: user.refresh_token,
      id,
      type,
    };
    return next();
  }).catch((err) => {
    console.error(err);
    res.status(401).send('Something was wrong about your authentication. Maybe your token is expired?');
  });
};

const checkUser = (req, res, next) => {
  let attemptedResource;
  const firstChar = req.url[1];
  if (firstChar === 'w') attemptedResource = 'werkers';
  else if (firstChar === 'm') attemptedResource = 'makers';
  else if (firstChar === 'f') attemptedResource = 'favorites';
  else attemptedResource = 'shifts';
  if (attemptedResource === 'werkers' && req.params.werkerId === req.user.id) {
    return next();
  } if (attemptedResource === 'makers' && req.params.makerId === req.user.id) {
    return next();
  } if (attemptedResource === 'favorites') {
    const type = req.query ? req.query.type : req.body.type;
    const id = Number(req.query ? req.query.id : req.body[`${type}Id`]);
    if (id === req.user.id && type === req.user.type) {
      return next();
    }
  } if (attemptedResource === 'shifts') {
    if (req.user.type !== 'werker') {
      return getMakerByShiftId(req.params.shiftId)
        .then((maker) => {
          if (maker.id === req.user.id) {
            return next();
          }
          return res.status(401).send('Attempt to access unauthorized resource');
        });
    }
    if (req.user.id === req.params.werkerId) {
      return next();
    }
  }
  return res.status(401).send('Attempt to access unauthorized resource.');
};

module.exports = {
  oauth2Client,
  loginFlow,
  checkLogin,
  checkUser,
};
