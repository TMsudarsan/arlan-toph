import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiShield } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cart, clearAllItems } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
        country: 'India',
    });
    const [notes, setNotes] = useState('');

    const totalAmount = cart.items?.reduce((sum, item) => {
        return sum + (item.product?.wholesalePrice || 0) * item.quantity;
    }, 0) || 0;

    const shipping = totalAmount >= 50000 ? 0 : 500;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!address.street || !address.city || !address.state || !address.pincode) {
            return toast.error('Please fill in all address fields');
        }
        try {
            setLoading(true);
            await api.createOrder({ shippingAddress: address, notes });
            toast.success('Order placed successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (!cart.items?.length) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-fashion-bg">
            <div className="section-padding py-8">
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-fashion-dark mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Shipping Address */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-6 shadow-soft mb-6">
                                <h3 className="font-display text-lg font-semibold mb-4">Shipping Address</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="text-sm text-fashion-medium mb-1 block">Street Address</label>
                                        <input
                                            type="text"
                                            value={address.street}
                                            onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                            className="input-field"
                                            placeholder="123 Fashion Street"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-fashion-medium mb-1 block">City</label>
                                        <input
                                            type="text"
                                            value={address.city}
                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                            className="input-field"
                                            placeholder="Mumbai"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-fashion-medium mb-1 block">State</label>
                                        <input
                                            type="text"
                                            value={address.state}
                                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                            className="input-field"
                                            placeholder="Maharashtra"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-fashion-medium mb-1 block">Pincode</label>
                                        <input
                                            type="text"
                                            value={address.pincode}
                                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                            className="input-field"
                                            placeholder="400001"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-fashion-medium mb-1 block">Country</label>
                                        <input type="text" value="India" className="input-field bg-gray-50" disabled />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-soft">
                                <h3 className="font-display text-lg font-semibold mb-4">Order Notes (Optional)</h3>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="input-field min-h-[100px]"
                                    placeholder="Any special instructions for your order..."
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-28">
                                <h3 className="font-display text-lg font-semibold mb-4">Order Summary</h3>

                                {/* Items */}
                                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                    {cart.items?.map((item) => (
                                        <div key={item._id} className="flex gap-3 items-center">
                                            <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                                <img
                                                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100'}
                                                    alt="" className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.product?.name}</p>
                                                <p className="text-xs text-fashion-medium">{item.quantity} pcs × ₹{item.product?.wholesalePrice}</p>
                                            </div>
                                            <p className="text-sm font-semibold shrink-0">
                                                ₹{((item.product?.wholesalePrice || 0) * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <hr className="border-gray-100 my-4" />

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-fashion-medium">
                                        <span>Subtotal</span>
                                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-fashion-medium">
                                        <span>Shipping</span>
                                        <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                                            {shipping === 0 ? 'Free' : `₹${shipping}`}
                                        </span>
                                    </div>
                                    <hr className="border-gray-100" />
                                    <div className="flex justify-between text-lg font-bold text-fashion-dark">
                                        <span>Total</span>
                                        <span>₹{(totalAmount + shipping).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-gold w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <FiCheck size={18} /> Place Wholesale Order
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center gap-2 justify-center mt-4 text-xs text-fashion-medium">
                                    <FiShield size={14} className="text-green-500" />
                                    Secure checkout • 100% safe
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
