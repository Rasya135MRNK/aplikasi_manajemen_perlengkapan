const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, categoryController.index);
router.get('/:id', authenticate, categoryController.show);
router.post('/', authenticate, categoryController.create);
router.put('/:id', authenticate, categoryController.update);
router.delete('/:id', authenticate, categoryController.destroy);

module.exports = router;
