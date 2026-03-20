import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
    try {
        const { shippingAddress, notes } = req.body;

        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const items = cart.items.map((item) => {
            let price = item.product.wholesalePrice;

            if (item.product.bulkPricingTiers?.length) {
                const sortedTiers = [...item.product.bulkPricingTiers]
                    .sort((a, b) => b.minQty - a.minQty);

                for (const tier of sortedTiers) {
                    if (item.quantity >= tier.minQty) {
                        price = tier.price;
                        break;
                    }
                }
            }

            return {
                product: item.product._id,
                name: item.product.name,
                image: item.product.images[0] || '',
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                price,
            };
        });

        const totalAmount = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            buyer: req.user._id,
            invoiceNumber: `INV-${Date.now()}`, // ✅ ADD THIS
            items,
            totalAmount,
            shippingAddress,
            notes,
            status: 'Pending'
        });

        // Update stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        cart.items = [];
        await cart.save();

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('buyer', 'name company email phone')
            .sort({ createdAt: -1 })
            .lean();

        res.json({ orders }); // ✅ IMPORTANT FIX

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('buyer', 'name email company phone address')
            .populate('items.product')
            .lean();

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (
            order.buyer._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
