import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';
import AdminLayout from './pages/admin/AdminLayout';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();
    if (loading) return null;
    return user && isAdmin ? children : <Navigate to="/login" />;
};

function App() {
    const { isAdmin } = useAuth();

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#2D2D2D',
                        color: '#fff',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        fontSize: '14px',
                    },
                }}
            />

            <Routes>
                {/* Admin routes - no navbar/footer */}
                <Route path="/admin/*" element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                } />

                {/* Public and buyer routes */}
                <Route path="*" element={
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/product/:id" element={<ProductDetail />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/cart" element={
                                    <ProtectedRoute><Cart /></ProtectedRoute>
                                } />
                                <Route path="/checkout" element={
                                    <ProtectedRoute><Checkout /></ProtectedRoute>
                                } />
                                <Route path="/dashboard" element={
                                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                                } />
                                <Route path="/wishlist" element={
                                    <ProtectedRoute><Wishlist /></ProtectedRoute>
                                } />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </main>
                        <Footer />
                        <WhatsAppButton />
                    </div>
                } />
            </Routes>
        </>
    );
}

export default App;
