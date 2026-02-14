import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import * as api from '../../api';
import toast from 'react-hot-toast';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Party Wear',
        images: [],
        sizes: [],
        colors: [],
        wholesalePrice: '',
        mrp: '',
        moq: 10,
        bulkPricingTiers: [],
        stock: 0,
        fabric: '',
        style: '',
        occasion: '',
        isAvailable: true,
    });

    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                try {
                    const { data } = await api.getProductById(id);
                    setFormData({
                        ...data,
                        wholesalePrice: data.wholesalePrice?.toString() || '',
                        mrp: data.mrp?.toString() || '',
                    });
                } catch (err) {
                    toast.error('Product not found');
                    navigate('/admin/products');
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.wholesalePrice || !formData.mrp) {
            return toast.error('Please fill in all required fields');
        }
        try {
            setLoading(true);
            const payload = {
                ...formData,
                wholesalePrice: Number(formData.wholesalePrice),
                mrp: Number(formData.mrp),
                moq: Number(formData.moq),
                stock: Number(formData.stock),
            };
            if (isEdit) {
                await api.updateProduct(id, payload);
                toast.success('Product updated!');
            } else {
                await api.createProduct(payload);
                toast.success('Product created!');
            }
            navigate('/admin/products');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const addSize = () => {
        if (newSize && !formData.sizes.includes(newSize)) {
            setFormData({ ...formData, sizes: [...formData.sizes, newSize] });
            setNewSize('');
        }
    };

    const addColor = () => {
        if (newColor && !formData.colors.includes(newColor)) {
            setFormData({ ...formData, colors: [...formData.colors, newColor] });
            setNewColor('');
        }
    };

    const addImageUrl = () => {
        if (newImageUrl) {
            setFormData({ ...formData, images: [...formData.images, newImageUrl] });
            setNewImageUrl('');
        }
    };

    const addBulkTier = () => {
        setFormData({
            ...formData,
            bulkPricingTiers: [...formData.bulkPricingTiers, { minQty: 50, price: '' }],
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl font-bold text-fashion-dark">
                    {isEdit ? 'Edit Product' : 'Add New Product'}
                </h1>
                <button onClick={() => navigate('/admin/products')} className="text-sm text-fashion-medium hover:text-fashion-dark flex items-center gap-1">
                    <FiX size={16} /> Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h3 className="font-display text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-fashion-medium mb-1 block">Product Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                                placeholder="Royal Silk Anarkali Suit"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-fashion-medium mb-1 block">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input-field min-h-[100px]"
                                placeholder="Describe the product in detail..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-fashion-medium mb-1 block">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input-field"
                                >
                                    <option>Party Wear</option>
                                    <option>Ethnic Wear</option>
                                    <option>Casual Wear</option>
                                    <option>Bridal Collections</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-fashion-medium mb-1 block">Fabric</label>
                                <input
                                    type="text"
                                    value={formData.fabric}
                                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                                    className="input-field"
                                    placeholder="Silk, Cotton, etc."
                                />
                            </div>
                            <div>
                                <label className="text-sm text-fashion-medium mb-1 block">Occasion</label>
                                <input
                                    type="text"
                                    value={formData.occasion}
                                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                                    className="input-field"
                                    placeholder="Wedding, Party, etc."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h3 className="font-display text-lg font-semibold mb-4">Images</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                        {formData.images.map((img, i) => (
                            <div key={i} className="relative w-20 h-24 rounded-xl overflow-hidden group border border-gray-100">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FiTrash2 className="text-white" size={16} />
                                </button>
                            </div>
                        ))}
                        <label className="w-20 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gold-400 hover:bg-gold-50 transition-colors">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    if (e.target.files?.length) {
                                        const uploadData = new FormData();
                                        Array.from(e.target.files).forEach((file) => {
                                            uploadData.append('images', file);
                                        });
                                        try {
                                            setLoading(true);
                                            const { data } = await api.uploadImages(uploadData);
                                            setFormData(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
                                            toast.success('Images uploaded!');
                                        } catch (err) {
                                            toast.error('Upload failed');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                            />
                            <FiPlus className="text-gray-400" size={24} />
                            <span className="text-[10px] text-gray-500 mt-1">Upload</span>
                        </label>
                    </div>
                    <div className="text-xs text-fashion-medium">
                        Supported formats: JPG, PNG, WEBP. Max 5MB per file.
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h3 className="font-display text-lg font-semibold mb-4">Pricing & Stock</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm text-fashion-medium mb-1 block">Wholesale Price (₹) *</label>
                            <input
                                type="number"
                                value={formData.wholesalePrice}
                                onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-fashion-medium mb-1 block">MRP (₹) *</label>
                            <input
                                type="number"
                                value={formData.mrp}
                                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-fashion-medium mb-1 block">MOQ (pcs)</label>
                            <input
                                type="number"
                                value={formData.moq}
                                onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                                className="input-field"
                                min={1}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-fashion-medium mb-1 block">Stock</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="input-field"
                                min={0}
                            />
                        </div>
                    </div>

                    {/* Bulk Pricing Tiers */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Bulk Pricing Tiers</label>
                            <button type="button" onClick={addBulkTier} className="text-sm text-gold-500 flex items-center gap-1">
                                <FiPlus size={14} /> Add Tier
                            </button>
                        </div>
                        {formData.bulkPricingTiers.map((tier, i) => (
                            <div key={i} className="flex gap-3 mb-2 items-center">
                                <input
                                    type="number"
                                    value={tier.minQty}
                                    onChange={(e) => {
                                        const tiers = [...formData.bulkPricingTiers];
                                        tiers[i].minQty = parseInt(e.target.value);
                                        setFormData({ ...formData, bulkPricingTiers: tiers });
                                    }}
                                    className="input-field !py-2 w-28"
                                    placeholder="Min Qty"
                                />
                                <span className="text-fashion-medium text-sm">pcs at</span>
                                <input
                                    type="number"
                                    value={tier.price}
                                    onChange={(e) => {
                                        const tiers = [...formData.bulkPricingTiers];
                                        tiers[i].price = parseInt(e.target.value);
                                        setFormData({ ...formData, bulkPricingTiers: tiers });
                                    }}
                                    className="input-field !py-2 w-28"
                                    placeholder="₹ Price"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, bulkPricingTiers: formData.bulkPricingTiers.filter((_, idx) => idx !== i) })}
                                    className="text-red-400 p-1"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sizes & Colors */}
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <h3 className="font-display text-lg font-semibold mb-4">Sizes & Colors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-fashion-medium mb-2 block">Sizes</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.sizes.map((size) => (
                                    <span key={size} className="badge-gold flex items-center gap-1">
                                        {size}
                                        <button type="button" onClick={() => setFormData({ ...formData, sizes: formData.sizes.filter((s) => s !== size) })}>
                                            <FiX size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSize}
                                    onChange={(e) => setNewSize(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                                    className="input-field !py-2 text-sm"
                                    placeholder="e.g. M, L, XL"
                                />
                                <button type="button" onClick={addSize} className="btn-secondary !py-2 text-sm">Add</button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-fashion-medium mb-2 block">Colors</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.colors.map((color) => (
                                    <span key={color} className="badge-rose flex items-center gap-1">
                                        {color}
                                        <button type="button" onClick={() => setFormData({ ...formData, colors: formData.colors.filter((c) => c !== color) })}>
                                            <FiX size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                                    className="input-field !py-2 text-sm"
                                    placeholder="e.g. Red, Blue"
                                />
                                <button type="button" onClick={addColor} className="btn-secondary !py-2 text-sm">Add</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Availability */}
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                            className="w-5 h-5 rounded accent-gold-400"
                        />
                        <span className="text-sm font-medium">Product is available for ordering</span>
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold flex items-center gap-2"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <FiSave size={16} /> {isEdit ? 'Update Product' : 'Create Product'}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;
