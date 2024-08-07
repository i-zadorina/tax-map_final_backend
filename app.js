const express = require('express');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');

const { PORT = 3001 } = process.env;
const app = express();

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log('Connected to DB');
})
.catch(console.error);

app.use(express.json());
app.use('/', indexRouter);
app.use((req, res, next) => {
  req.user = {
    _id: '66b26d820e1364ca77c7ca8c'
  };
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
