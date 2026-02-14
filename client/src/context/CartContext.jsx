import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart({ items: [] });
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await api.getCart();
            setCart(data);
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (productId, quantity, size, color) => {
        try {
            const { data } = await api.addToCart({ productId, quantity, size, color });
            setCart(data);
            toast.success('Added to cart!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add to cart');
        }
    };

    const updateItem = async (itemId, quantity) => {
        try {
            const { data } = await api.updateCartItem({ itemId, quantity });
            setCart(data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update');
        }
    };

    const removeItem = async (itemId) => {
        try {
            const { data } = await api.removeFromCart(itemId);
            setCart(data);
            toast.success('Removed from cart');
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    const clearAllItems = async () => {
        try {
            await api.clearCart();
            setCart({ items: [] });
        } catch (err) {
            toast.error('Failed to clear cart');
        }
    };

    const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, clearAllItems, fetchCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
