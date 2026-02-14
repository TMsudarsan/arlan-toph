import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiPercent, FiUsers, FiStar, FiPackage } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import * as api from '../api';

const Home = () => {
    const [bestSellers, setBestSellers] = useState([]);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const { data } = await api.getProducts({ limit: 4 });
                setBestSellers(data.products);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBestSellers();
    }, []);

    const categories = [
        {
            name: 'Party Wear',
            image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600',
            desc: 'Glamorous party dresses',
        },
        {
            name: 'Ethnic Wear',
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
            desc: 'Traditional elegance',
        },
        {
            name: 'Casual Wear',
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
            desc: 'Everyday style',
        },
        {
            name: 'Bridal Collections',
            image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600',
            desc: 'Wedding specials',
        },
    ];

    const testimonials = [
        { name: 'Priya Sharma', company: 'Trends Boutique, Mumbai', text: 'Arlan Toph Forth has been our go-to wholesale supplier for 3 years. The quality is consistently excellent and their MOQ is very reasonable.', rating: 5 },
        { name: 'Anil Kumar', company: 'Fashion Hub, Delhi', text: 'Best wholesale prices in the market. Their bridal collection is absolutely stunning and our customers love it.', rating: 5 },
        { name: 'Meera Patel', company: 'Style Studio, Ahmedabad', text: 'Quick delivery, amazing fabric quality, and great bulk discounts. Highly recommended for retailers!', rating: 5 },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-cream-100 via-rose-50 to-blush-50">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-200/30 rounded-full blur-3xl animate-float" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl" />
                </div>
                <div className="section-padding py-16 lg:py-24 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div className="fade-in">
                            <span className="badge-gold mb-4 inline-block">B2B Wholesale Platform</span>
                            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-fashion-dark leading-tight mb-6">
                                Premium Fashion <br />
                                <span className="text-gradient">Wholesale Hub</span>
                            </h1>
                            <p className="text-fashion-medium text-lg mb-8 max-w-lg leading-relaxed">
                                Discover 500+ trendy women&apos;s dresses at unbeatable wholesale prices.
                                Exclusively for retailers and boutique owners.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/products" className="btn-gold flex items-center gap-2 text-lg">
                                    Shop Wholesale <FiArrowRight />
                                </Link>
                                <Link to="/register" className="btn-secondary flex items-center gap-2">
                                    Register as Buyer
                                </Link>
                            </div>
                            <div className="flex items-center gap-8 mt-10 text-sm text-fashion-medium">
                                <div className="flex items-center gap-2">
                                    <FiPackage className="text-gold-400" size={18} />
                                    <span>500+ Styles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiTruck className="text-gold-400" size={18} />
                                    <span>Pan India Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiShield className="text-gold-400" size={18} />
                                    <span>Quality Assured</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="rounded-2xl overflow-hidden shadow-premium h-64">
                                        <img src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400" alt="Fashion" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-card h-48">
                                        <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400" alt="Fashion" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="rounded-2xl overflow-hidden shadow-card h-48">
                                        <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400" alt="Fashion" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-premium h-64">
                                        <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" alt="Fashion" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section-padding py-16 lg:py-20">
                <div className="text-center mb-12">
                    <span className="badge-gold mb-3 inline-block">Collections</span>
                    <h2 className="font-display text-3xl lg:text-4xl font-bold text-fashion-dark mb-3">
                        Shop by Category
                    </h2>
                    <p className="text-fashion-medium max-w-md mx-auto">
                        Explore our curated categories of premium wholesale dresses
                    </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-soft hover:shadow-premium transition-all duration-500"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <h3 className="font-display text-lg lg:text-xl font-bold text-white mb-1">{cat.name}</h3>
                                <p className="text-white/70 text-sm">{cat.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Best Sellers */}
            {bestSellers.length > 0 && (
                <section className="bg-cream-50 py-16 lg:py-20">
                    <div className="section-padding">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <span className="badge-gold mb-3 inline-block">Trending</span>
                                <h2 className="font-display text-3xl lg:text-4xl font-bold text-fashion-dark">
                                    Best Sellers
                                </h2>
                            </div>
                            <Link to="/products" className="text-gold-500 font-medium flex items-center gap-1 hover:gap-2 transition-all text-sm">
                                View All <FiArrowRight />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            {bestSellers.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bulk Discounts Banner */}
            <section className="section-padding py-16">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-fashion-dark to-fashion-charcoal p-10 lg:p-16">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
                    <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <span className="badge bg-gold-400/20 text-gold-300 mb-4 inline-block">Limited Offer</span>
                            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
                                Bulk Order Discounts<br />
                                <span className="text-gold-400">Up to 40% Off</span>
                            </h2>
                            <p className="text-gray-300 mb-6">
                                Order more, save more. Special pricing tiers available for orders of 50+ pieces.
                                Contact us for custom bulk pricing.
                            </p>
                            <Link to="/products" className="btn-gold inline-flex items-center gap-2">
                                Start Ordering <FiArrowRight />
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            {[
                                { qty: '25+ pcs', discount: '10% Off', color: 'bg-gold-400/10' },
                                { qty: '50+ pcs', discount: '20% Off', color: 'bg-gold-400/15' },
                                { qty: '100+ pcs', discount: '40% Off', color: 'bg-gold-400/20' },
                            ].map((tier) => (
                                <div key={tier.qty} className={`${tier.color} rounded-2xl p-6 backdrop-blur-sm`}>
                                    <FiPercent size={24} className="text-gold-400 mx-auto mb-2" />
                                    <p className="text-white font-bold text-lg">{tier.discount}</p>
                                    <p className="text-gray-400 text-sm">{tier.qty}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-sage-50 py-16 lg:py-20">
                <div className="section-padding">
                    <div className="text-center mb-12">
                        <span className="badge-sage mb-3 inline-block">Why Us</span>
                        <h2 className="font-display text-3xl lg:text-4xl font-bold text-fashion-dark mb-3">
                            Why Choose Arlan Toph Forth
                        </h2>
                        <p className="text-fashion-medium max-w-md mx-auto">
                            Trusted by 2000+ retailers across India
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: FiPercent, title: 'Best Wholesale Prices', desc: 'Direct from manufacturer pricing with transparent bulk discounts' },
                            { icon: FiShield, title: 'Quality Assured', desc: 'Every piece goes through 5-step quality check before dispatch' },
                            { icon: FiTruck, title: 'Fast Delivery', desc: 'Pan India shipping within 3-5 business days for all orders' },
                            { icon: FiUsers, title: 'Dedicated Support', desc: 'Personal account manager for all wholesale buyers' },
                        ].map((item) => (
                            <div key={item.title} className="bg-white rounded-2xl p-6 text-center shadow-soft hover:shadow-card transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center mx-auto mb-4">
                                    <item.icon size={24} className="text-green-700" />
                                </div>
                                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-fashion-medium text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding py-16 lg:py-20">
                <div className="text-center mb-12">
                    <span className="badge-rose mb-3 inline-block">Testimonials</span>
                    <h2 className="font-display text-3xl lg:text-4xl font-bold text-fashion-dark mb-3">
                        What Our Retailers Say
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300">
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.rating)].map((_, j) => (
                                    <FiStar key={j} size={16} className="text-gold-400" fill="#C5A55A" />
                                ))}
                            </div>
                            <p className="text-fashion-medium text-sm mb-4 italic leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                            <div>
                                <p className="font-semibold text-fashion-dark">{t.name}</p>
                                <p className="text-xs text-fashion-medium">{t.company}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
