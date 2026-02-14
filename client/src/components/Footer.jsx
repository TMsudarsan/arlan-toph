import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-fashion-dark text-white">
            {/* Newsletter */}
            <div className="bg-gradient-to-r from-gold-400 to-gold-500 py-10">
                <div className="section-padding text-center">
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
                        Join Our Wholesale Network
                    </h3>
                    <p className="text-white/80 mb-6 text-sm">
                        Get early access to new collections, bulk discounts, and trade offers
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your business email"
                            className="flex-1 px-5 py-3 rounded-full text-fashion-dark outline-none"
                        />
                        <button className="bg-fashion-dark text-white px-6 py-3 rounded-full font-medium hover:bg-fashion-charcoal transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            <div className="section-padding py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <h2 className="font-display text-2xl font-bold mb-1">
                            ARLAN TOPH <span className="text-gold-400">FORTH</span>
                        </h2>
                        <p className="text-[10px] tracking-[3px] text-gray-400 mb-4">WHOLESALE FASHION</p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            India&apos;s trusted B2B platform for wholesale women&apos;s fashion.
                            Premium quality dresses at unbeatable wholesale prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link to="/products" className="hover:text-gold-400 transition-colors">All Products</Link></li>
                            <li><Link to="/products?category=Party Wear" className="hover:text-gold-400 transition-colors">Party Wear</Link></li>
                            <li><Link to="/products?category=Ethnic Wear" className="hover:text-gold-400 transition-colors">Ethnic Wear</Link></li>
                            <li><Link to="/products?category=Casual Wear" className="hover:text-gold-400 transition-colors">Casual Wear</Link></li>
                            <li><Link to="/products?category=Bridal Collections" className="hover:text-gold-400 transition-colors">Bridal Collections</Link></li>
                        </ul>
                    </div>

                    {/* Business */}
                    <div>
                        <h4 className="font-display text-lg font-semibold mb-4">For Retailers</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link to="/register" className="hover:text-gold-400 transition-colors">Register as Buyer</Link></li>
                            <li><Link to="/login" className="hover:text-gold-400 transition-colors">Buyer Login</Link></li>
                            <li className="hover:text-gold-400 transition-colors cursor-pointer">Bulk Pricing</li>
                            <li className="hover:text-gold-400 transition-colors cursor-pointer">Shipping Policy</li>
                            <li className="hover:text-gold-400 transition-colors cursor-pointer">Return Policy</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-center gap-2">
                                <FiMapPin size={16} className="text-gold-400 shrink-0" />
                                Fashion District, Mumbai, India
                            </li>
                            <li className="flex items-center gap-2">
                                <FiPhone size={16} className="text-gold-400" />
                                +91 98765 43210
                            </li>
                            <li className="flex items-center gap-2">
                                <FiMail size={16} className="text-gold-400" />
                                wholesale@arlantoph.com
                            </li>
                        </ul>
                        <div className="flex gap-3 mt-4">
                            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors">
                                <FaWhatsapp size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors">
                                <FiInstagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <FiMail size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-white/10 py-6">
                <div className="section-padding flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-xs">
                    <p>© 2024 Arlan Toph Forth. All rights reserved.</p>
                    <p>Designed for Wholesale Fashion Business</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
