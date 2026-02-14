import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get('/products/categories');

// Cart
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const updateCartItem = (data) => API.put('/cart', data);
export const removeFromCart = (itemId) => API.delete(`/cart/${itemId}`);
export const clearCart = () => API.delete('/cart/clear');

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const downloadInvoice = (id) => API.get(`/orders/${id}/invoice`, { responseType: 'blob' });

// Wishlist
export const getWishlist = () => API.get('/wishlist');
export const toggleWishlist = (productId) => API.post('/wishlist/toggle', { productId });

// Admin
export const getDashboardStats = () => API.get('/admin/dashboard');
export const getAllOrders = (params) => API.get('/admin/orders', { params });
export const updateOrderStatus = (id, status) => API.put(`/admin/orders/${id}/status`, { status });
export const getAllUsers = () => API.get('/admin/users');
export const approveUser = (id, isApproved) => API.put(`/admin/users/${id}/approve`, { isApproved });
export const getAllProductsAdmin = () => API.get('/admin/products');
export const updateStock = (id, data) => API.put(`/admin/products/${id}/stock`, data);

// Admin Product CRUD
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Upload
export const uploadImages = (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});
