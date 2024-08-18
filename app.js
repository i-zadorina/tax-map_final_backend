const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");
const indexRouter = require('./routes/index');

const { PORT = 3001 } = process.env;
const app = express();

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log('Connected to DB');
})
.catch(console.error);

app.use(bodyParser.json());

app.use(cors());

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;