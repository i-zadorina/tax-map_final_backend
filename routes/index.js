const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { errorCode, errorMessage } = require('../utils/errors');
const { login, createUser } = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/items', itemRouter);
router.use('/users', userRouter);

router.use((req, res) => {
  res.status(errorCode.idNotFound).send({ message: errorMessage.idNotFound });
});

module.exports = router;