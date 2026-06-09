const router = require('express').Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', authenticate, roleCheck('super_admin'), userController.index);
router.put('/:id/toggle-active', authenticate, roleCheck('super_admin'), userController.toggleActive);

module.exports = router;
