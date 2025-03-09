const router = require('express').Router();
const userRouter = require('./users');
const { login, createUser } = require('../controllers/users');

// Import middlewares for validation
const {
  validateLogin,
  validateCreateUser,
} = require('../middlewares/validation');

// Import 404 error
const NotFoundError = require('../utils/errors/NotFoundError');

// For known endpoints
router.post('/login', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use('/users', userRouter);

// For unknown routes
router.use((req, res, next) => {
  console.log(req);
  next(new NotFoundError('Invalid route'));
});

module.exports = router;
