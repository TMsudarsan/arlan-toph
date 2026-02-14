import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import * as api from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Products = () => {
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [wishlist, setWishlist] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        search: searchParams.get('search') || '',
        minPrice: '',
        maxPrice: '',
        size: '',
        color: '',
    });

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            category: searchParams.get('category') || '',
            search: searchParams.get('search') || '',
        }));
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, [filters, currentPage]);

    useEffect(() => {
        if (user) fetchWishlist();
    }, [user]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = { page: currentPage, limit: 12 };
            if (filters.category) params.category = filters.category;
            if (filters.search) params.search = filters.search;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.size) params.size = filters.size;
            if (filters.color) params.color = filters.color;

            const { data } = await api.getProducts(params);
            setProducts(data.products);
            setTotalPages(data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const { data } = await api.getWishlist();
            setWishlist(data.map((p) => p._id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleWishlistToggle = async (productId) => {
        if (!user) return toast.error('Please login first');
        try {
            const { data } = await api.toggleWishlist(productId);
            setWishlist(data.wishlist);
        } catch (err) {
            toast.error('Failed to update wishlist');
        }
    };

    const categories = ['Party Wear', 'Ethnic Wear', 'Casual Wear', 'Bridal Collections'];
    const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
    const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Pink', 'Yellow', 'Gold', 'Maroon', 'Navy Blue'];

    const clearFilters = () => {
        setFilters({ category: '', search: '', minPrice: '', maxPrice: '', size: '', color: '' });
        setCurrentPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-fashion-bg">
            {/* Header */}
            <div className="bg-gradient-to-r from-cream-100 to-rose-50 py-10">
                <div className="section-padding">
                    <h1 className="font-display text-3xl lg:text-4xl font-bold text-fashion-dark mb-2">
                        {filters.category || 'All Collections'}
                    </h1>
                    <p className="text-fashion-medium">
                        {filters.search ? `Search results for "${filters.search}"` : 'Discover premium wholesale dresses at unbeatable prices'}
                    </p>
                </div>
            </div>

            <div className="section-padding py-8">
                <div className="flex gap-6">
                    {/* Sidebar Filters - Desktop */}
                    <div className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:p-0' : 'hidden lg:block'} w-full lg:w-64 shrink-0`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-lg font-semibold">Filters</h3>
                            <div className="flex gap-2">
                                {activeFilterCount > 0 && (
                                    <button onClick={clearFilters} className="text-xs text-rose-500 font-medium">Clear All</button>
                                )}
                                <button onClick={() => setShowFilters(false)} className="lg:hidden p-1">
                                    <FiX size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold mb-3 text-fashion-dark">Category</h4>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === cat}
                                            onChange={() => { setFilters((p) => ({ ...p, category: p.category === cat ? '' : cat })); setCurrentPage(1); }}
                                            className="accent-gold-400"
                                        />
                                        <span className="text-sm text-fashion-medium group-hover:text-fashion-dark transition-colors">{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold mb-3 text-fashion-dark">Wholesale Price (₹)</h4>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => { setFilters((p) => ({ ...p, minPrice: e.target.value })); setCurrentPage(1); }}
                                    className="input-field !py-2 text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => { setFilters((p) => ({ ...p, maxPrice: e.target.value })); setCurrentPage(1); }}
                                    className="input-field !py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Size */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold mb-3 text-fashion-dark">Size</h4>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => { setFilters((p) => ({ ...p, size: p.size === s ? '' : s })); setCurrentPage(1); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.size === s ? 'bg-fashion-dark text-white' : 'bg-gray-100 text-fashion-medium hover:bg-gray-200'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold mb-3 text-fashion-dark">Color</h4>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => { setFilters((p) => ({ ...p, color: p.color === c ? '' : c })); setCurrentPage(1); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.color === c ? 'bg-fashion-dark text-white' : 'bg-gray-100 text-fashion-medium hover:bg-gray-200'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => setShowFilters(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm"
                            >
                                <FiFilter size={16} /> Filters
                                {activeFilterCount > 0 && (
                                    <span className="bg-gold-400 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>
                                )}
                            </button>
                            <p className="text-sm text-fashion-medium">
                                {loading ? 'Loading...' : `Showing ${products.length} products`}
                            </p>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                                        <div className="aspect-[3/4] bg-gray-200" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-6xl mb-4">👗</p>
                                <h3 className="font-display text-xl font-semibold mb-2">No products found</h3>
                                <p className="text-fashion-medium text-sm mb-4">Try adjusting your filters</p>
                                <button onClick={clearFilters} className="btn-primary text-sm">Clear Filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            isWishlisted={wishlist.includes(product._id)}
                                            onWishlistToggle={handleWishlistToggle}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-10">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${currentPage === i + 1 ? 'bg-fashion-dark text-white' : 'bg-white text-fashion-medium hover:bg-gray-100'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
