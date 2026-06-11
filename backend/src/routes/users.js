const router = require('express').Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, userController.index);
router.put('/:id/toggle-active', authenticate, userController.toggleActive);

module.exports = router;
