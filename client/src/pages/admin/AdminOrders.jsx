import { useState, useEffect } from 'react';
import { FiPackage } from 'react-icons/fi';
import * as api from '../../api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filter) params.status = filter;
            const { data } = await api.getAllOrders(params);
            setOrders(data.orders);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.updateOrderStatus(id, status);
            setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
            toast.success(`Order updated to ${status}`);
        } catch (err) {
            toast.error('Failed to update order');
        }
    };

    const statuses = ['Pending', 'Approved', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

    const statusColors = {
        Pending: 'bg-yellow-100 text-yellow-700',
        Approved: 'bg-blue-100 text-blue-700',
        Packed: 'bg-purple-100 text-purple-700',
        Shipped: 'bg-cyan-100 text-cyan-700',
        Delivered: 'bg-green-100 text-green-700',
        Cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <div>
            <h1 className="font-display text-2xl font-bold text-fashion-dark mb-6">Order Management</h1>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setFilter('')}
                    className={`px-4 py-2 rounded-xl text-sm transition-all ${!filter ? 'bg-fashion-dark text-white' : 'bg-white text-fashion-medium hover:bg-gray-100'
                        }`}
                >
                    All
                </button>
                {statuses.map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all ${filter === status ? 'bg-fashion-dark text-white' : 'bg-white text-fashion-medium hover:bg-gray-100'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 h-24" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl">
                    <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">No orders found</h3>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl p-6 shadow-soft">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <p className="font-mono text-xs text-fashion-medium">{order.invoiceNumber}</p>
                                    <p className="font-semibold mt-1">{order.buyer?.name} — {order.buyer?.company}</p>
                                    <p className="text-xs text-fashion-medium">{order.buyer?.email} • {order.buyer?.phone}</p>
                                    <p className="text-xs text-fashion-medium mt-1">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-fashion-dark">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                    <span className={`badge text-[10px] mt-1 ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Items summary */}
                            <div className="text-sm text-fashion-medium mb-4">
                                {order.items?.map((item, i) => (
                                    <span key={i}>
                                        {item.name} ({item.quantity}pcs)
                                        {i < order.items.length - 1 ? ' • ' : ''}
                                    </span>
                                ))}
                            </div>

                            {/* Status update */}
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                <span className="text-xs text-fashion-medium">Update Status:</span>
                                <div className="flex flex-wrap gap-1">
                                    {statuses.map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(order._id, status)}
                                            disabled={order.status === status}
                                            className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${order.status === status
                                                    ? 'bg-fashion-dark text-white'
                                                    : 'bg-gray-100 text-fashion-medium hover:bg-gray-200'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
