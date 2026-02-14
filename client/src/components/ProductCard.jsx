import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onWishlistToggle, isWishlisted }) => {
    const { user } = useAuth();

    return (
        <div className="card-product group">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="badge-gold text-[10px]">MOQ: {product.moq} pcs</span>
                    {product.stock < 50 && (
                        <span className="badge-rose text-[10px]">Low Stock</span>
                    )}
                </div>

                {/* Wishlist */}
                {user && (
                    <button
                        onClick={(e) => { e.preventDefault(); onWishlistToggle?.(product._id); }}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-fashion-dark hover:bg-rose-500 hover:text-white'
                            }`}
                    >
                        <FiHeart size={16} fill={isWishlisted ? 'white' : 'none'} />
                    </button>
                )}

                {/* Quick action */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <Link
                        to={`/product/${product._id}`}
                        className="w-full bg-fashion-dark/90 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-fashion-dark transition-colors backdrop-blur-sm"
                    >
                        <FiShoppingBag size={16} /> View Details
                    </Link>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <Link to={`/product/${product._id}`}>
                    <p className="text-xs text-gold-400 font-medium tracking-wide mb-1">{product.category}</p>
                    <h3 className="font-display text-base font-semibold text-fashion-dark mb-2 line-clamp-1 hover:text-gold-500 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Pricing */}
                {user ? (
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-fashion-dark">₹{product.wholesalePrice}</span>
                        <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
                        <span className="text-xs font-semibold text-green-600">
                            {Math.round((1 - product.wholesalePrice / product.mrp) * 100)}% off
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-fashion-medium">
                        <FiLock size={14} />
                        <span className="text-sm">Login to see price</span>
                    </div>
                )}

                {/* Sizes */}
                <div className="flex gap-1.5 mt-3 flex-wrap">
                    {product.sizes?.slice(0, 4).map((size) => (
                        <span key={size} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-fashion-medium">
                            {size}
                        </span>
                    ))}
                    {product.sizes?.length > 4 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-fashion-medium">
                            +{product.sizes.length - 4}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
