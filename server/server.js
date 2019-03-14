const express = require('express');
const models = require('../db/index');

const app = express();

const port = process.env.PORT || 4000;


// models.sequelize.sync();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
