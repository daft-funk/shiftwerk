/* eslint-disable camelcase */
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

const checkLogin = (req, res, next) => {
  const { id_token } = req.query;
  return oauth2Client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
    .then(ticket => ticket.getPayload())
    .then((payload) => {
      req.user.id = payload.sub;
      next();
    })
    .catch((err) => {
      console.error(err);
      return res.status(403).send('Unauthenticated user');
    });
};

module.exports = {
  oauth2Client,
  checkLogin,
};
