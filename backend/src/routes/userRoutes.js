const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, getAdminUser } = require('../controllers/UserController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/admin', protect, getAdminUser);

router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id/role')
  .put(protect, admin, updateUserRole);

module.exports = router;
