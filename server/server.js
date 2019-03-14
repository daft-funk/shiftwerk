const express = require('express');
<<<<<<< HEAD
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist/Angular6App'));

=======
const models = require('../db/index');

const app = express();

>>>>>>> 3c03b7910133a1ca8ba8d794c4ae5425b7d13251
const port = process.env.PORT || 4000;


// models.sequelize.sync();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
