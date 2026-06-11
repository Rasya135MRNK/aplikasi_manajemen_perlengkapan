const router = require('express').Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/auth');

router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.post('/register', authenticate, authController.register);

module.exports = router;
