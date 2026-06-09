const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', authenticate, categoryController.index);
router.get('/:id', authenticate, categoryController.show);
router.post('/', authenticate, roleCheck('super_admin', 'admin'), categoryController.create);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin'), categoryController.update);
router.delete('/:id', authenticate, roleCheck('super_admin', 'admin'), categoryController.destroy);

module.exports = router;
