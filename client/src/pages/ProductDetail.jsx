import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTruck, FiShield, FiMinus, FiPlus, FiChevronLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import * as api from '../api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(10);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.getProductById(id);
                setProduct(data);
                setQuantity(data.moq);
                if (data.sizes?.length) setSelectedSize(data.sizes[0]);
                if (data.colors?.length) setSelectedColor(data.colors[0]);
            } catch (err) {
                toast.error('Product not found');
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (user) {
            api.getWishlist().then(({ data }) => {
                setIsWishlisted(data.some((p) => p._id === id));
            }).catch(() => { });
        }
    }, [user, id]);

    const handleAddToCart = () => {
        if (!user) return toast.error('Please login to add to cart');
        if (!selectedSize) return toast.error('Please select a size');
        if (!selectedColor) return toast.error('Please select a color');
        addItem(product._id, quantity, selectedSize, selectedColor);
    };

    const handleWishlistToggle = async () => {
        if (!user) return toast.error('Please login first');
        try {
            await api.toggleWishlist(product._id);
            setIsWishlisted(!isWishlisted);
            toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
        } catch (err) {
            toast.error('Failed to update wishlist');
        }
    };

    const getCurrentPrice = () => {
        if (!product) return 0;
        let price = product.wholesalePrice;
        if (product.bulkPricingTiers?.length) {
            const sorted = [...product.bulkPricingTiers].sort((a, b) => b.minQty - a.minQty);
            for (const tier of sorted) {
                if (quantity >= tier.minQty) {
                    price = tier.price;
                    break;
                }
            }
        }
        return price;
    };

    if (loading) {
        return (
            <div className="section-padding py-20">
                <div className="animate-pulse grid lg:grid-cols-2 gap-10">
                    <div className="aspect-[3/4] bg-gray-200 rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                        <div className="h-8 bg-gray-200 rounded w-2/3" />
                        <div className="h-20 bg-gray-200 rounded w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-fashion-bg">
            <div className="section-padding py-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-fashion-medium hover:text-fashion-dark text-sm mb-6">
                    <FiChevronLeft /> Back
                </button>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-soft">
                            <img
                                src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images?.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-gold-400 shadow-soft' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="fade-in">
                        <span className="badge-gold mb-3">{product.category}</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-fashion-dark mb-3">{product.name}</h1>

                        {/* Price */}
                        {user ? (
                            <div className="mb-6">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-3xl font-bold text-fashion-dark">₹{getCurrentPrice()}</span>
                                    <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                                    <span className="badge-sage">
                                        {Math.round((1 - getCurrentPrice() / product.mrp) * 100)}% off
                                    </span>
                                </div>
                                <p className="text-sm text-fashion-medium">Wholesale price per piece</p>
                            </div>
                        ) : (
                            <div className="bg-cream-100 rounded-xl p-4 mb-6">
                                <p className="text-fashion-medium text-sm">🔒 <strong>Login to see wholesale pricing.</strong> Register as a buyer to access exclusive wholesale rates.</p>
                            </div>
                        )}

                        <p className="text-fashion-medium leading-relaxed mb-6">{product.description}</p>

                        {/* Details grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {product.fabric && (
                                <div className="bg-cream-50 rounded-xl p-3">
                                    <p className="text-xs text-fashion-medium">Fabric</p>
                                    <p className="text-sm font-semibold">{product.fabric}</p>
                                </div>
                            )}
                            <div className="bg-cream-50 rounded-xl p-3">
                                <p className="text-xs text-fashion-medium">MOQ</p>
                                <p className="text-sm font-semibold">{product.moq} pieces</p>
                            </div>
                            <div className="bg-cream-50 rounded-xl p-3">
                                <p className="text-xs text-fashion-medium">Stock</p>
                                <p className="text-sm font-semibold">{product.stock > 0 ? `${product.stock} pcs` : 'Out of stock'}</p>
                            </div>
                            {product.occasion && (
                                <div className="bg-cream-50 rounded-xl p-3">
                                    <p className="text-xs text-fashion-medium">Occasion</p>
                                    <p className="text-sm font-semibold">{product.occasion}</p>
                                </div>
                            )}
                        </div>

                        {/* Size */}
                        <div className="mb-5">
                            <h4 className="text-sm font-semibold mb-2">Select Size</h4>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes?.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSize === size
                                                ? 'bg-fashion-dark text-white shadow-soft'
                                                : 'bg-gray-100 text-fashion-medium hover:bg-gray-200'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color */}
                        <div className="mb-5">
                            <h4 className="text-sm font-semibold mb-2">Select Color</h4>
                            <div className="flex flex-wrap gap-2">
                                {product.colors?.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedColor === color
                                                ? 'bg-fashion-dark text-white shadow-soft'
                                                : 'bg-gray-100 text-fashion-medium hover:bg-gray-200'
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold mb-2">Quantity (Min: {product.moq} pcs)</h4>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(product.moq, quantity - product.moq))}
                                    className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                >
                                    <FiMinus size={16} />
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                                    className="w-24 text-center input-field !py-2"
                                    min={product.moq}
                                />
                                <button
                                    onClick={() => setQuantity(quantity + product.moq)}
                                    className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                >
                                    <FiPlus size={16} />
                                </button>
                            </div>
                            {user && (
                                <p className="text-sm text-gold-500 font-medium mt-2">
                                    Total: ₹{(getCurrentPrice() * quantity).toLocaleString('en-IN')}
                                </p>
                            )}
                        </div>

                        {/* Bulk Pricing Tiers */}
                        {product.bulkPricingTiers?.length > 0 && user && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold mb-2">Bulk Pricing Tiers</h4>
                                <div className="bg-cream-50 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-cream-200">
                                                <th className="px-4 py-2 text-left text-fashion-medium font-medium">Quantity</th>
                                                <th className="px-4 py-2 text-left text-fashion-medium font-medium">Price / pc</th>
                                                <th className="px-4 py-2 text-left text-fashion-medium font-medium">Savings</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={`border-b border-cream-200 ${quantity < (product.bulkPricingTiers[0]?.minQty || Infinity) ? 'bg-gold-50' : ''}`}>
                                                <td className="px-4 py-2">{product.moq}+ pcs</td>
                                                <td className="px-4 py-2 font-semibold">₹{product.wholesalePrice}</td>
                                                <td className="px-4 py-2 text-green-600">Base price</td>
                                            </tr>
                                            {product.bulkPricingTiers.sort((a, b) => a.minQty - b.minQty).map((tier) => (
                                                <tr key={tier.minQty} className={`border-b border-cream-200 ${quantity >= tier.minQty ? 'bg-gold-50' : ''}`}>
                                                    <td className="px-4 py-2">{tier.minQty}+ pcs</td>
                                                    <td className="px-4 py-2 font-semibold">₹{tier.price}</td>
                                                    <td className="px-4 py-2 text-green-600">
                                                        Save ₹{product.wholesalePrice - tier.price}/pc
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 mb-6">
                            <button onClick={handleAddToCart} className="btn-gold flex-1 flex items-center justify-center gap-2">
                                <FiShoppingBag size={18} /> Add to Cart
                            </button>
                            <button
                                onClick={handleWishlistToggle}
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isWishlisted ? 'bg-rose-500 border-rose-500 text-white' : 'border-gray-200 text-fashion-medium hover:border-rose-500 hover:text-rose-500'
                                    }`}
                            >
                                <FiHeart size={18} fill={isWishlisted ? 'white' : 'none'} />
                            </button>
                        </div>

                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/919876543210?text=Hi! I'm interested in bulk ordering "${product.name}" (${quantity} pcs). Please share more details.`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition-colors mb-6"
                        >
                            <FaWhatsapp size={20} /> Inquire on WhatsApp
                        </a>

                        {/* Trust badges */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm text-fashion-medium">
                                <FiTruck className="text-gold-400" size={18} />
                                Free shipping on ₹50K+
                            </div>
                            <div className="flex items-center gap-2 text-sm text-fashion-medium">
                                <FiShield className="text-gold-400" size={18} />
                                Quality guaranteed
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
