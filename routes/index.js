const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { errorCode, errorMessage } = require("../utils/errors");

router.use('/users', userRouter);
router.use('/items', itemRouter);
router.use((req, res) => {
  res.status(errorCode.idNotFound).send({ message: errorMessage.idNotFound });
});

module.exports = router;