const Message = require('../models/Message');

// @desc    Obtener mensajes de un chat específico
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    }).sort('createdAt');

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obtener lista de conversaciones (para admin)
// @route   GET /api/messages/conversations
// @access  Private/Admin
exports.getConversations = async (req, res) => {
  try {
    const adminId = req.user.id;
    
    const messages = await Message.find({
      $or: [{ sender: adminId }, { receiver: adminId }]
    })
    .sort('-createdAt')
    .populate('sender', 'name email')
    .populate('receiver', 'name email');

    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === adminId ? msg.receiver : msg.sender;
      
      if (!conversationsMap.has(otherUser._id.toString())) {
        conversationsMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0
        });
      }
      
      if (msg.sender._id.toString() === otherUser._id.toString() && !msg.read) {
        conversationsMap.get(otherUser._id.toString()).unreadCount += 1;
      }
    });

    res.json({ success: true, data: Array.from(conversationsMap.values()) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obtener mensajes no leídos del cliente actual (admin -> cliente)
// @route   GET /api/messages/unread/count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    // Client view: how many messages received by user are unread
    const count = await Message.countDocuments({ receiver: userId, read: false });
    res.json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Marcar mensajes como leídos
// @route   PUT /api/messages/read/:senderId
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.senderId;

    await Message.updateMany(
      { sender: senderId, receiver: receiverId, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
