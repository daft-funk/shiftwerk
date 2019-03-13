const express = require('express');
const models = require('../db/index');

const app = express();

app.use(express.static('dist/Angular6App'));

const port = process.env.PORT || 4000;


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
