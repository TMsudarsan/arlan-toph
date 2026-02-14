import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { cart, updateItem, removeItem, clearAllItems, cartCount } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="font-display text-2xl font-bold mb-2">Please Login</h2>
                    <p className="text-fashion-medium mb-4">Login to view your cart</p>
                    <Link to="/login" className="btn-gold">Login Now</Link>
                </div>
            </div>
        );
    }

    const totalAmount = cart.items?.reduce((sum, item) => {
        const price = item.product?.wholesalePrice || 0;
        return sum + price * item.quantity;
    }, 0) || 0;

    if (!cart.items?.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center fade-in">
                    <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
                    <p className="text-fashion-medium mb-6">Browse our collections and add items to your cart</p>
                    <Link to="/products" className="btn-gold">Browse Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-fashion-bg">
            <div className="section-padding py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-fashion-dark">Shopping Cart</h1>
                        <p className="text-fashion-medium text-sm">{cartCount} items in cart</p>
                    </div>
                    <button onClick={clearAllItems} className="text-sm text-rose-500 hover:text-rose-600 font-medium">
                        Clear Cart
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item._id} className="bg-white rounded-2xl p-4 shadow-soft fade-in">
                                <div className="flex gap-4">
                                    <Link to={`/product/${item.product?._id}`} className="w-24 h-32 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                        <img
                                            src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200'}
                                            alt={item.product?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${item.product?._id}`}>
                                            <h3 className="font-display font-semibold text-fashion-dark truncate hover:text-gold-500 transition-colors">
                                                {item.product?.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-fashion-medium mt-1">
                                            {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                                        </p>
                                        <p className="text-sm text-fashion-medium mt-1">
                                            ₹{item.product?.wholesalePrice} × {item.quantity} pcs
                                        </p>
                                        <p className="text-lg font-bold text-fashion-dark mt-1">
                                            ₹{((item.product?.wholesalePrice || 0) * item.quantity).toLocaleString('en-IN')}
                                        </p>

                                        {/* Quantity controls */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateItem(item._id, Math.max(item.product?.moq || 1, item.quantity - (item.product?.moq || 1)))}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                                >
                                                    <FiMinus size={14} />
                                                </button>
                                                <span className="w-16 text-center text-sm font-semibold">{item.quantity} pcs</span>
                                                <button
                                                    onClick={() => updateItem(item._id, item.quantity + (item.product?.moq || 1))}
                                                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                                >
                                                    <FiPlus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item._id)}
                                                className="p-2 text-rose-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-28">
                            <h3 className="font-display text-lg font-semibold mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-fashion-medium">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-fashion-medium">
                                    <span>Shipping</span>
                                    <span className={totalAmount >= 50000 ? 'text-green-600' : ''}>
                                        {totalAmount >= 50000 ? 'Free' : '₹500'}
                                    </span>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="flex justify-between text-lg font-bold text-fashion-dark">
                                    <span>Total</span>
                                    <span>₹{(totalAmount + (totalAmount >= 50000 ? 0 : 500)).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            {totalAmount < 50000 && (
                                <p className="text-xs text-green-600 bg-green-50 rounded-lg p-3 mb-4">
                                    🚚 Add ₹{(50000 - totalAmount).toLocaleString('en-IN')} more for free shipping!
                                </p>
                            )}
                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn-gold w-full flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
