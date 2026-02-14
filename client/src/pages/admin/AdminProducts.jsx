import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiPackage } from 'react-icons/fi';
import * as api from '../../api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.getAllProductsAdmin();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            toast.success('Product deleted');
        } catch (err) {
            toast.error('Failed to delete product');
        }
    };

    const handleStockUpdate = async (id, stock) => {
        try {
            await api.updateStock(id, { stock: parseInt(stock) });
            toast.success('Stock updated');
        } catch (err) {
            toast.error('Failed to update stock');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl font-bold text-fashion-dark">Products</h1>
                <Link to="/admin/products/new" className="btn-gold text-sm flex items-center gap-2">
                    <FiPlus size={16} /> Add Product
                </Link>
            </div>

            {loading ? (
                <div className="bg-white rounded-2xl p-6 animate-pulse">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
                        ))}
                    </div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl">
                    <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">No products yet</h3>
                    <Link to="/admin/products/new" className="btn-gold text-sm inline-block mt-4">Add First Product</Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">Product</th>
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">Category</th>
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">Price</th>
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">MOQ</th>
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">Stock</th>
                                    <th className="text-left py-3 px-4 text-fashion-medium font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                    <img
                                                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100'}
                                                        alt="" className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                                                    <p className="text-xs text-fashion-medium">{product.sizes?.join(', ')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="badge-gold text-[10px]">{product.category}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="font-semibold">₹{product.wholesalePrice}</p>
                                            <p className="text-xs text-fashion-medium line-through">₹{product.mrp}</p>
                                        </td>
                                        <td className="py-3 px-4">{product.moq} pcs</td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                defaultValue={product.stock}
                                                onBlur={(e) => handleStockUpdate(product._id, e.target.value)}
                                                className="w-20 px-2 py-1 rounded-lg border border-gray-200 text-sm text-center"
                                                min={0}
                                            />
                                            {product.stock < 20 && (
                                                <p className="text-[10px] text-red-500 mt-1">Low stock!</p>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                                                >
                                                    <FiEdit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
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

export default AdminProducts;
