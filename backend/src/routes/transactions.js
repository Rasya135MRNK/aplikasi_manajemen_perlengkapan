const router = require('express').Router();
const transactionController = require('../controllers/transactionController');
const authenticate = require('../middlewares/auth');

router.post('/checkin', authenticate, transactionController.checkin);
router.post('/checkout', authenticate, transactionController.checkout);
router.get('/', authenticate, transactionController.index);

module.exports = router;
