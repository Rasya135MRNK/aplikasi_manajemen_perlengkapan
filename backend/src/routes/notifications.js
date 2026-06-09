const router = require('express').Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, notificationController.index);
router.get('/unread-count', authenticate, notificationController.unreadCount);
router.put('/:id/read', authenticate, notificationController.markAsRead);

module.exports = router;
