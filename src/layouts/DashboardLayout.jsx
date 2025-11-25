import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Inbox, Send, LogOut, Mail, Plus, Menu, User, Search, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ComposeModal from '../components/ComposeModal';
import API_BASE_URL from '../config/api';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const isActive = (path) => location.pathname.includes(path);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/auth/user`, {
                    headers: { 'x-auth-token': token },
                });
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    const NavItem = ({ to, icon: Icon, label, active }) => (
        <Link
            to={to}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                    ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
            <span className="text-sm tracking-wide">{label}</span>
            {active && <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
        </Link>
    );

    return (
        <div className="flex h-screen bg-[#0f172a] font-sans text-gray-100 overflow-hidden">
            <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#0f172a] border-r border-white/5 flex flex-col transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="p-6 flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
                        <Mail className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">MiracMail</span>
                </div>

                <div className="px-6 mb-8">
                    <button
                        onClick={() => {
                            setIsComposeOpen(true);
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white p-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20 group"
                    >
                        <Plus className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                        Compose Email
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</div>
                    <NavItem to="/inbox" icon={Inbox} label="Inbox" active={isActive('inbox')} />
                    <NavItem to="/sent" icon={Send} label="Sent" active={isActive('sent')} />
                </nav>

                <div className="p-4 border-t border-white/5 mx-4 mb-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                            ME
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'My Account'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || 'user@miracmail.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#0f172a]">
                {/* Mobile Header */}
                <div className="md:hidden bg-[#0f172a]/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/5 z-30 sticky top-0">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Mail className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white">MiracMail</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-400 hover:bg-white/5 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
