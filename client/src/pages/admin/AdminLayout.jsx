import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiBarChart2, FiPlus, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminProductForm from './AdminProductForm';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: FiBarChart2, exact: true },
        { path: '/admin/products', label: 'Products', icon: FiShoppingBag },
        { path: '/admin/orders', label: 'Orders', icon: FiPackage },
        { path: '/admin/users', label: 'Buyers', icon: FiUsers },
    ];

    const isActive = (path, exact) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-fashion-dark text-white transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6">
                    <Link to="/" className="block">
                        <h1 className="font-display text-lg font-bold">
                            ARLAN TOPH <span className="text-gold-400">FORTH</span>
                        </h1>
                        <p className="text-[9px] tracking-[2px] text-gray-400">ADMIN PANEL</p>
                    </Link>
                </div>

                <nav className="px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.path, item.exact)
                                    ? 'bg-gold-400/20 text-gold-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={18} /> {item.label}
                        </Link>
                    ))}

                    <Link
                        to="/admin/products/new"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-green-400 hover:bg-green-400/10 transition-all mt-4"
                    >
                        <FiPlus size={18} /> Add Product
                    </Link>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-white/5 rounded-xl p-3 mb-3">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-400/10 w-full transition-all"
                    >
                        <FiLogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <main className="flex-1 min-w-0">
                {/* Top bar */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between lg:justify-end">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2">
                        <FiGrid size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.[0]}
                        </div>
                        <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                    </div>
                </div>

                <div className="p-6">
                    <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<AdminProductForm />} />
                        <Route path="products/edit/:id" element={<AdminProductForm />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="users" element={<AdminUsers />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
