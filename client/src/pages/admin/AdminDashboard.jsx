import { useState, useEffect } from 'react';
import { FiShoppingBag, FiPackage, FiUsers, FiDollarSign, FiAlertTriangle, FiClock } from 'react-icons/fi';
import * as api from '../../api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthlyRevenue, setMonthlyRevenue] = useState(null);
    const [monthlyLoading, setMonthlyLoading] = useState(false);

    useEffect(() => {
        const fetchMonthlyRevenue = async () => {
            setMonthlyLoading(true);
            try {
                const { data } = await api.getMonthlyRevenue({ month: selectedMonth, year: selectedYear });
                setMonthlyRevenue(data);
            } catch (err) {
                console.error(err);
            } finally {
                setMonthlyLoading(false);
            }
        };
        fetchMonthlyRevenue();
    }, [selectedMonth, selectedYear]);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 h-32" />
                    ))}
                </div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: FiDollarSign, color: 'bg-green-50 text-green-600' },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FiPackage, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Products', value: stats?.totalProducts || 0, icon: FiShoppingBag, color: 'bg-purple-50 text-purple-600' },
        { label: 'Registered Buyers', value: stats?.totalUsers || 0, icon: FiUsers, color: 'bg-cyan-50 text-cyan-600' },
        { label: 'Pending Approvals', value: stats?.pendingApprovals || 0, icon: FiClock, color: 'bg-yellow-50 text-yellow-600' },
        { label: 'Low Stock Items', value: stats?.lowStockProducts || 0, icon: FiAlertTriangle, color: 'bg-red-50 text-red-600' },
    ];

    return (
        <div>
            <h1 className="font-display text-2xl font-bold text-fashion-dark mb-6">Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-soft">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-fashion-dark">{stat.value}</p>
                        <p className="text-xs text-fashion-medium mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Monthly Revenue Section */}
            <div className="bg-white rounded-2xl p-6 shadow-soft mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="font-display text-lg font-semibold">Monthly Revenue</h3>
                    <div className="flex gap-3">
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-200 text-fashion-dark text-sm rounded-xl focus:ring-fashion-dark focus:border-fashion-dark block p-2.5 outline-none transition-all"
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                        <select 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-200 text-fashion-dark text-sm rounded-xl focus:ring-fashion-dark focus:border-fashion-dark block p-2.5 outline-none transition-all"
                        >
                            {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {monthlyLoading ? (
                    <div className="h-20 animate-pulse bg-gray-100 rounded-xl"></div>
                ) : (
                    <div className="flex flex-wrap gap-6">
                        <div className="bg-green-50 rounded-xl p-5 flex-1 min-w-[200px]">
                            <p className="text-sm text-green-600 mb-1 font-medium">Revenue This Month</p>
                            <p className="text-3xl font-bold text-green-700">₹{(monthlyRevenue?.totalRevenue || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-5 flex-1 min-w-[200px]">
                            <p className="text-sm text-blue-600 mb-1 font-medium">Orders This Month</p>
                            <p className="text-3xl font-bold text-blue-700">{monthlyRevenue?.totalOrders || 0}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Order status breakdown */}
            {stats?.ordersByStatus && (
                <div className="bg-white rounded-2xl p-6 shadow-soft mb-8">
                    <h3 className="font-display text-lg font-semibold mb-4">Orders by Status</h3>
                    <div className="flex flex-wrap gap-3">
                        {stats.ordersByStatus.map((status) => (
                            <div key={status._id} className="bg-gray-50 rounded-xl px-4 py-3 text-center min-w-[100px]">
                                <p className="text-xl font-bold text-fashion-dark">{status.count}</p>
                                <p className="text-xs text-fashion-medium">{status._id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Orders */}
            {stats?.recentOrders?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h3 className="font-display text-lg font-semibold mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-2 text-fashion-medium font-medium">Invoice</th>
                                    <th className="text-left py-3 px-2 text-fashion-medium font-medium">Buyer</th>
                                    <th className="text-left py-3 px-2 text-fashion-medium font-medium">Amount</th>
                                    <th className="text-left py-3 px-2 text-fashion-medium font-medium">Status</th>
                                    <th className="text-left py-3 px-2 text-fashion-medium font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3 px-2 font-mono text-xs">{order.invoiceNumber}</td>
                                        <td className="py-3 px-2">
                                            <p className="font-medium">{order.buyer?.name}</p>
                                            <p className="text-xs text-fashion-medium">{order.buyer?.company}</p>
                                        </td>
                                        <td className="py-3 px-2 font-semibold">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                                        <td className="py-3 px-2">
                                            <span className={`badge text-[10px] ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        order.status === 'Shipped' ? 'bg-cyan-100 text-cyan-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-fashion-medium text-xs">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
