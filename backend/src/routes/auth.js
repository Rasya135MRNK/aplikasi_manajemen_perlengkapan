const router = require('express').Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.post('/register', authenticate, roleCheck('super_admin'), authController.register);

module.exports = router;
