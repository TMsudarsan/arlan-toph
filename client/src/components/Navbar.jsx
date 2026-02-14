import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiLogOut, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const [mobileMenu, setMobileMenu] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const categories = [
        { name: 'Party Wear', path: '/products?category=Party Wear' },
        { name: 'Ethnic Wear', path: '/products?category=Ethnic Wear' },
        { name: 'Casual Wear', path: '/products?category=Casual Wear' },
        { name: 'Bridal', path: '/products?category=Bridal Collections' },
    ];

    return (
        <nav className="glass-nav sticky top-0 z-50 shadow-sm">
            {/* Top bar */}
            <div className="bg-fashion-dark text-white text-center py-1.5 text-xs tracking-wider font-body">
                ✨ Wholesale Only — Minimum Order Quantity Applies | <span className="text-gold-300">Free Shipping on Orders Above ₹50,000</span>
            </div>

            <div className="section-padding">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Mobile menu toggle */}
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2">
                        {mobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="text-center">
                            <h1 className="font-display text-xl lg:text-2xl font-bold tracking-wide text-fashion-dark">
                                ARLAN TOPH <span className="text-gold-400">FORTH</span>
                            </h1>
                            <p className="text-[9px] lg:text-[10px] font-body tracking-[3px] text-fashion-medium -mt-1">
                                WHOLESALE FASHION
                            </p>
                        </div>
                    </Link>

                    {/* Desktop categories */}
                    <div className="hidden lg:flex items-center gap-8">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                to={cat.path}
                                className="text-sm font-medium text-fashion-medium hover:text-fashion-dark transition-colors relative group"
                            >
                                {cat.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <FiSearch size={20} />
                        </button>

                        {user && (
                            <>
                                <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                                    <FiHeart size={20} />
                                </Link>
                                <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                                    <FiShoppingBag size={20} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-gold-400 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}

                        {user ? (
                            <div className="relative group">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <FiUser size={20} />
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-premium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-semibold truncate">{user.name}</p>
                                        <p className="text-xs text-fashion-medium">{user.role === 'admin' ? 'Admin' : 'Buyer'}</p>
                                    </div>
                                    {isAdmin ? (
                                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                                            <FiGrid size={16} /> Admin Panel
                                        </Link>
                                    ) : (
                                        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                                            <FiGrid size={16} /> Dashboard
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors w-full text-left text-red-500">
                                        <FiLogOut size={16} /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary text-sm !px-5 !py-2">
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Search bar */}
                {searchOpen && (
                    <div className="pb-4 fade-in">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search dresses, categories, styles..."
                                className="input-field flex-1"
                                autoFocus
                            />
                            <button type="submit" className="btn-gold !py-2">Search</button>
                        </form>
                    </div>
                )}
            </div>

            {/* Mobile menu */}
            {mobileMenu && (
                <div className="lg:hidden bg-white border-t shadow-premium fade-in">
                    <div className="py-4 px-6 space-y-3">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                to={cat.path}
                                onClick={() => setMobileMenu(false)}
                                className="block py-2 text-sm font-medium text-fashion-medium hover:text-fashion-dark"
                            >
                                {cat.name}
                            </Link>
                        ))}
                        <hr className="border-gray-100" />
                        {user && (
                            <>
                                <Link to="/wishlist" onClick={() => setMobileMenu(false)} className="block py-2 text-sm">Wishlist</Link>
                                <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setMobileMenu(false)} className="block py-2 text-sm">
                                    {isAdmin ? 'Admin Panel' : 'Dashboard'}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
