import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await api.loginUser(formData);
            login(data);
            toast.success(`Welcome back, ${data.name}!`);
            navigate(data.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 via-rose-50 to-cream-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl p-8 shadow-premium fade-in">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="font-display text-2xl font-bold text-fashion-dark">
                            ARLAN TOPH <span className="text-gold-400">FORTH</span>
                        </h1>
                        <p className="text-xs tracking-[3px] text-fashion-medium mt-1">WHOLESALE FASHION</p>
                        <h2 className="font-display text-xl font-semibold mt-4">Welcome Back</h2>
                        <p className="text-sm text-fashion-medium mt-1">Login to access wholesale pricing</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-fashion-medium mb-1 block">Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field !pl-11"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-fashion-medium mb-1 block">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field !pl-11 !pr-11"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gold w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-fashion-medium mt-6">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-gold-500 font-semibold hover:underline">
                            Register as Buyer
                        </Link>
                    </p>

                    {/* Demo credentials */}
                    <div className="mt-6 bg-cream-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-fashion-dark mb-2">Demo Credentials:</p>
                        <div className="text-xs text-fashion-medium space-y-1">
                            <p>Admin: admin@arlantoph.com / admin123</p>
                            <p>Buyer: buyer@test.com / buyer123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
