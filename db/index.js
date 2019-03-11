// HAVE NOT TESTED - ONCE VM INSTANCE RUNNING, CONNECT TO DB 
// SET PORT, UPDATE .ENV, AND TEST - frank
const postgres = require('postgres');

const connection = postgres.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD, 
  database: process.env.DBNAME,
  port: process.env.PORT,
})

conncection.connect((err) => {
  if (!err) {
    console.log(`shiftwerk-db connected on port ${port}`);
  } else {
    console.log(`There was a problem connected to shiftwerk-db on port ${port}! Error: `, err);
  }
})