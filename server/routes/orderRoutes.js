import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController.js';
import { protect, approvedOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, approvedOnly, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

export default router;
