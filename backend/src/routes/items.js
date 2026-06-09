const router = require('express').Router();
const itemController = require('../controllers/itemController');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const upload = require('../middlewares/upload');

router.get('/', authenticate, itemController.index);
router.get('/:id', authenticate, itemController.show);
router.post('/', authenticate, roleCheck('super_admin', 'admin'), upload.single('image'), itemController.create);
router.put('/:id', authenticate, roleCheck('super_admin', 'admin'), upload.single('image'), itemController.update);
router.delete('/:id', authenticate, roleCheck('super_admin', 'admin'), itemController.destroy);

module.exports = router;
