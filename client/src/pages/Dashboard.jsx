import { useState, useEffect } from 'react';
import { FiPackage, FiDownload, FiUser, FiClock, FiCheckCircle, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.getMyOrders();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            const { data } = await api.downloadInvoice(orderId);
            const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${orderId}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success('Invoice downloaded!');
        } catch (err) {
            toast.error('Failed to download invoice');
        }
    };

    const statusConfig = {
        Pending: { color: 'bg-yellow-100 text-yellow-700', icon: FiClock },
        Approved: { color: 'bg-blue-100 text-blue-700', icon: FiCheckCircle },
        Packed: { color: 'bg-purple-100 text-purple-700', icon: FiPackage },
        Shipped: { color: 'bg-cyan-100 text-cyan-700', icon: FiTruck },
        Delivered: { color: 'bg-green-100 text-green-700', icon: FiCheckCircle },
        Cancelled: { color: 'bg-red-100 text-red-700', icon: FiAlertCircle },
    };

    return (
        <div className="min-h-screen bg-fashion-bg">
            <div className="bg-gradient-to-r from-cream-100 to-rose-50 py-10">
                <div className="section-padding">
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-fashion-dark mb-1">
                        Welcome, {user?.name}
                    </h1>
                    <p className="text-fashion-medium text-sm">{user?.company || 'Wholesale Buyer'}</p>
                    {!user?.isApproved && user?.role !== 'admin' && (
                        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700 inline-flex items-center gap-2">
                            <FiAlertCircle size={16} /> Your account is pending admin approval. You cannot place orders yet.
                        </div>
                    )}
                </div>
            </div>

            <div className="section-padding py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    {[
                        { id: 'orders', label: 'Order History', icon: FiPackage },
                        { id: 'profile', label: 'Profile', icon: FiUser },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 px-2 text-sm font-medium transition-all border-b-2 ${activeTab === tab.id
                                    ? 'border-gold-400 text-fashion-dark'
                                    : 'border-transparent text-fashion-medium hover:text-fashion-dark'
                                }`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'orders' && (
                    <div>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                                        <div className="h-6 bg-gray-200 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-20">
                                <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="font-display text-xl font-semibold mb-2">No orders yet</h3>
                                <p className="text-fashion-medium text-sm">Start shopping to see your orders here</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => {
                                    const StatusIcon = statusConfig[order.status]?.icon || FiClock;
                                    return (
                                        <div key={order._id} className="bg-white rounded-2xl p-6 shadow-soft">
                                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-fashion-medium">Invoice: {order.invoiceNumber}</p>
                                                    <p className="text-xs text-fashion-medium">
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                            year: 'numeric', month: 'long', day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`badge ${statusConfig[order.status]?.color}`}>
                                                        <StatusIcon size={12} className="mr-1" /> {order.status}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDownloadInvoice(order._id)}
                                                        className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-600 font-medium"
                                                    >
                                                        <FiDownload size={14} /> Invoice
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Items */}
                                            <div className="space-y-2 mb-4">
                                                {order.items?.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                            <img
                                                                src={item.image || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100'}
                                                                alt="" className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                                            <p className="text-xs text-fashion-medium">
                                                                {item.quantity} pcs × ₹{item.price}
                                                                {item.size ? ` • ${item.size}` : ''}
                                                                {item.color ? ` • ${item.color}` : ''}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm font-semibold shrink-0">
                                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                                <p className="text-sm text-fashion-medium">
                                                    {order.items?.reduce((s, i) => s + i.quantity, 0)} pieces total
                                                </p>
                                                <p className="text-lg font-bold text-fashion-dark">
                                                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="bg-white rounded-2xl p-6 shadow-soft max-w-xl">
                        <h3 className="font-display text-lg font-semibold mb-4">Account Details</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Name', value: user?.name },
                                { label: 'Email', value: user?.email },
                                { label: 'Phone', value: user?.phone || '-' },
                                { label: 'Company', value: user?.company || '-' },
                                { label: 'Account Status', value: user?.isApproved ? '✅ Approved' : '⏳ Pending Approval' },
                            ].map((item) => (
                                <div key={item.label} className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-sm text-fashion-medium">{item.label}</span>
                                    <span className="text-sm font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
