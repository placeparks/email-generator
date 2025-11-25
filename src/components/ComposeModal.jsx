import { useState } from 'react';
import axios from 'axios';
import { X, Send, Paperclip, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config/api';

const ComposeModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ to: '', subject: '', text: '' });
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/emails/send`, formData, {
                headers: { 'x-auth-token': token },
            });
            alert('Email Sent');
            setFormData({ to: '', subject: '', text: '' });
            onClose();
        } catch (err) {
            console.error(err.response?.data);
            alert('Failed to send email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[600px] h-[90vh] md:h-[600px] bg-[#1e293b] rounded-t-2xl md:rounded-2xl shadow-2xl z-50 flex flex-col border border-white/10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-[#0f172a] border-b border-white/5">
                            <h3 className="text-lg font-bold text-white">New Message</h3>
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                                <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={onSubmit} className="flex-1 flex flex-col">
                            <div className="px-6 py-4 space-y-4 flex-1 overflow-y-auto">
                                <div className="space-y-1">
                                    <input
                                        type="email"
                                        name="to"
                                        placeholder="To"
                                        value={formData.to}
                                        onChange={onChange}
                                        className="w-full bg-transparent border-b border-white/10 py-2 text-white placeholder-gray-500 focus:border-blue-500 outline-none transition-colors text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        name="subject"
                                        placeholder="Subject"
                                        value={formData.subject}
                                        onChange={onChange}
                                        className="w-full bg-transparent border-b border-white/10 py-2 text-white font-medium placeholder-gray-500 focus:border-blue-500 outline-none transition-colors text-sm"
                                        required
                                    />
                                </div>
                                <textarea
                                    name="text"
                                    placeholder="Write your message..."
                                    value={formData.text}
                                    onChange={onChange}
                                    className="w-full h-full min-h-[200px] bg-transparent resize-none text-gray-300 placeholder-gray-600 outline-none text-sm leading-relaxed"
                                    required
                                />
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-[#0f172a] border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={onClose} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? 'Sending...' : (
                                            <>
                                                Send <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ComposeModal;
