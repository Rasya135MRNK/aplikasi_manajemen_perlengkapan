const router = require('express').Router();
const loanController = require('../controllers/loanController');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, loanController.index);
router.get('/overdue', authenticate, loanController.overdue);
router.get('/:id', authenticate, loanController.show);
router.post('/', authenticate, loanController.create);
router.put('/:id/return', authenticate, loanController.returnItem);

module.exports = router;
