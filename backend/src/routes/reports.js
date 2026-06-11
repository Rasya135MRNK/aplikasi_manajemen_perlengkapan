const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const reportController = require('../controllers/reportController');
const authenticate = require('../middlewares/auth');

router.get('/dashboard', authenticate, dashboardController.summary);
router.get('/stock', authenticate, reportController.stockReport);
router.get('/transactions', authenticate, reportController.transactionReport);
router.get('/loans', authenticate, reportController.loanReport);

module.exports = router;
