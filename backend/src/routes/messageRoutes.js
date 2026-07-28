const express = require('express');
const router = express.Router();
const { getMessages, getConversations, getUnreadCount, markAsRead } = require('../controllers/MessageController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/conversations', protect, admin, getConversations);
router.get('/unread/count', protect, getUnreadCount);
router.get('/:userId', protect, getMessages);
router.put('/read/:senderId', protect, markAsRead);

module.exports = router;
