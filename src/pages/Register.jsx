import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation for email domain
        if (!formData.email.toLowerCase().endsWith('@miracmail.com')) {
            alert('Only emails ending with @miracmail.com are allowed');
            return;
        }
        
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
            localStorage.setItem('token', res.data.token);
            navigate('/inbox');
        } catch (err) {
            console.error(err.response?.data);
            alert('Registration Failed: ' + (err.response?.data?.msg || 'Server Error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10 w-full max-w-[460px] relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="bg-gradient-to-tr from-cyan-500 to-blue-400 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                        <Mail className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Join MiracMail</h2>
                    <p className="text-gray-400 mt-3 text-base">Experience the future of email</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="w-5 h-5 absolute left-4 top-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                onChange={onChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all text-white placeholder-gray-600"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="w-5 h-5 absolute left-4 top-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                placeholder="you@miracmail.com"
                                onChange={onChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all text-white placeholder-gray-600"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 ml-1">Only @miracmail.com emails are allowed</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="w-5 h-5 absolute left-4 top-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                onChange={onChange}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all text-white placeholder-gray-600"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-500 text-white py-3.5 rounded-xl font-bold hover:from-cyan-500 hover:to-blue-400 transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                    >
                        {loading ? 'Creating Account...' : (
                            <>
                                Sign Up <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline transition-colors">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
