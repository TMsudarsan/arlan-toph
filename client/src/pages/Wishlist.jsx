import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import * as api from '../api';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const { data } = await api.getWishlist();
            setWishlistItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleWishlistToggle = async (productId) => {
        try {
            await api.toggleWishlist(productId);
            setWishlistItems((prev) => prev.filter((p) => p._id !== productId));
            toast.success('Removed from wishlist');
        } catch (err) {
            toast.error('Failed to update wishlist');
        }
    };

    return (
        <div className="min-h-screen bg-fashion-bg">
            <div className="bg-gradient-to-r from-rose-50 to-cream-100 py-10">
                <div className="section-padding">
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-fashion-dark mb-1">My Wishlist</h1>
                    <p className="text-fashion-medium text-sm">{wishlistItems.length} saved items</p>
                </div>
            </div>

            <div className="section-padding py-8">
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                                <div className="aspect-[3/4] bg-gray-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-20">
                        <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="font-display text-xl font-semibold mb-2">No saved items</h3>
                        <p className="text-fashion-medium text-sm">Items you add to your wishlist will appear here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {wishlistItems.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                isWishlisted={true}
                                onWishlistToggle={handleWishlistToggle}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
