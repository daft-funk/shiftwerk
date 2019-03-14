require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors());

const models = require('../db/index');


app.get('/', (req, res) => {
  res.send("I'm connected!");
});



const port = process.env.PORT || 4000;
// models.sequelize.sync();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
