const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const reportController = require('../controllers/reportController');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/dashboard', authenticate, dashboardController.summary);
router.get('/stock', authenticate, roleCheck('super_admin', 'admin'), reportController.stockReport);
router.get('/transactions', authenticate, roleCheck('super_admin', 'admin'), reportController.transactionReport);
router.get('/loans', authenticate, roleCheck('super_admin', 'admin'), reportController.loanReport);

module.exports = router;
