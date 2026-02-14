import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase, FiFileText, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', company: '', gstin: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        try {
            setLoading(true);
            const { data } = await api.registerUser(formData);
            login(data);
            toast.success('Registration successful! Your account is pending admin approval.');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 via-rose-50 to-cream-100 px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-3xl p-8 shadow-premium fade-in">
                    <div className="text-center mb-8">
                        <h1 className="font-display text-2xl font-bold text-fashion-dark">
                            ARLAN TOPH <span className="text-gold-400">FORTH</span>
                        </h1>
                        <p className="text-xs tracking-[3px] text-fashion-medium mt-1">WHOLESALE FASHION</p>
                        <h2 className="font-display text-xl font-semibold mt-4">Register as Wholesale Buyer</h2>
                        <p className="text-sm text-fashion-medium mt-1">Create your B2B account to start ordering</p>
                    </div>

                    <div className="bg-cream-50 rounded-xl p-3 mb-6 text-xs text-fashion-medium text-center">
                        ⓘ After registration, an admin will review and approve your account before you can place orders.
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-fashion-medium mb-1 block">Full Name *</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange('name')}
                                        className="input-field !pl-11"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-fashion-medium mb-1 block">Phone</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange('phone')}
                                        className="input-field !pl-11"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-fashion-medium mb-1 block">Business Email *</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    className="input-field !pl-11"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-fashion-medium mb-1 block">Password *</label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    className="input-field !pl-11 !pr-11"
                                    placeholder="Min 6 characters"
                                    required
                                    minLength={6}
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-fashion-medium mb-1 block">Company Name</label>
                                <div className="relative">
                                    <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={handleChange('company')}
                                        className="input-field !pl-11"
                                        placeholder="Your Business"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-fashion-medium mb-1 block">GSTIN</label>
                                <div className="relative">
                                    <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={formData.gstin}
                                        onChange={handleChange('gstin')}
                                        className="input-field !pl-11"
                                        placeholder="Optional"
                                    />
                                </div>
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
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-fashion-medium mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-gold-500 font-semibold hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
