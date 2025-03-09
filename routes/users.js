const router = require('express').Router();
const { getCurrentUser, updateData } = require('../controllers/users');
const { validateDataUpdate } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/me', getCurrentUser);
router.patch('/me', validateDataUpdate, updateData);

module.exports = router;
