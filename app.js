require('dotenv').config();
//  Import from packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import middleware
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');

//  Import routes index
const routes = require('./routes/index');

const { PORT = 3001 } = process.env;
const app = express();

//  Connect to database
mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(console.error);

//  App's logic
app.use(bodyParser.json());

app.use(cors());

app.use(requestLogger);
app.use('/', routes);

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler

app.use(errorHandler); // centralized error handler

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
