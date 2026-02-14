import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity, size, color } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (quantity < product.moq) {
            return res.status(400).json({ message: `Minimum order quantity is ${product.moq} pieces` });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId && item.size === size && item.color === color
        );

        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            cart.items.push({ product: productId, quantity, size, color });
        }

        await cart.save();
        cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const product = await Product.findById(item.product);
        if (quantity < product.moq) {
            return res.status(400).json({ message: `Minimum order quantity is ${product.moq} pieces` });
        }

        item.quantity = quantity;
        await cart.save();
        const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
        await cart.save();
        const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
