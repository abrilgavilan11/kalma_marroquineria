const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrders, 
  getMyOrders, 
  updateOrderStatus 
} = require('../controllers/OrderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Rutas de órdenes
router.route('/')
  .post(protect, createOrder) // El usuario logueado crea orden
  .get(protect, admin, getOrders); // El admin ve todas las órdenes

router.route('/myorders')
  .get(protect, getMyOrders); // El usuario ve sus propias órdenes

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus); // El admin cambia el estado (Enviado, etc)

module.exports = router;
