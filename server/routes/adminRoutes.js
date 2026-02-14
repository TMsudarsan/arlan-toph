import express from 'express';
import { getDashboardStats, getAllOrders, updateOrderStatus, getAllUsers, approveUser, getAllProducts, updateStock } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/orders', protect, adminOnly, getAllOrders);
router.put('/orders/:id/status', protect, adminOnly, updateOrderStatus);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/approve', protect, adminOnly, approveUser);
router.get('/products', protect, adminOnly, getAllProducts);
router.put('/products/:id/stock', protect, adminOnly, updateStock);

export default router;
