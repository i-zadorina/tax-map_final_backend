//  Import from packages
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Import middleware
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { limiter } = require('./middlewares/limiter');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Server crash testing route
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

//  Import routes index
const routes = require('./routes/index');

const { PORT = 3001 } = process.env;

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

app.use(limiter);
app.use(requestLogger);
app.use('/', routes);

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler

app.use(errorHandler); // centralized error handler


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
