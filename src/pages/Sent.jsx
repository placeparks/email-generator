import { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Search, Send, Clock, ChevronLeft, Trash2, Star, MoreHorizontal, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config/api';

const Sent = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEmails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/emails/sent`, {
                headers: { 'x-auth-token': token },
            });
            setEmails(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    const filteredEmails = emails.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-full bg-[#0f172a] text-gray-100">
            {/* Email List */}
            <div className={`${selectedEmail ? 'hidden lg:flex' : 'flex'} w-full lg:w-[420px] flex-col border-r border-white/5 bg-[#0f172a]`}>
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Sent</h1>
                        <div className="flex items-center gap-2">
                            <button onClick={fetchEmails} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Refresh">
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">{filteredEmails.length}</span>
                        </div>
                    </div>
                    <div className="relative group">
                        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search sent emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl focus:bg-white/10 focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all text-sm text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    <AnimatePresence>
                        {filteredEmails.map((email) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                key={email._id}
                                onClick={() => setSelectedEmail(email)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedEmail?._id === email._id
                                        ? 'bg-blue-600/10 border-blue-500/30 shadow-lg shadow-blue-900/10'
                                        : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                                    }`}
                            >
                                <div className="flex justify-between items-baseline mb-1.5">
                                    <span className="text-sm truncate pr-2 text-white font-bold">
                                        To: {email.to}
                                    </span>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(email.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <h3 className="text-sm mb-1.5 truncate text-gray-200 font-semibold">
                                    {email.subject}
                                </h3>
                                <p className="text-xs text-gray-500 truncate leading-relaxed">{email.text}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredEmails.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <Send className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-sm">No sent emails</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reading Pane */}
            <div className={`${selectedEmail ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-[#0f172a]/50`}>
                {selectedEmail ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col h-full"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0f172a]/95 backdrop-blur-md z-10">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <button onClick={() => setSelectedEmail(null)} className="lg:hidden p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                                </button>
                                <div className="min-w-0">
                                    <h2 className="text-xl font-bold text-white leading-tight mb-1.5 truncate">{selectedEmail.subject}</h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span className="font-medium text-white">Me</span>
                                        <span className="text-xs text-gray-500">to {selectedEmail.to}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button className="p-2.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors">
                                    <Star className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                    <Archive className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-8 font-mono">
                                <Clock className="w-3 h-3" />
                                {new Date(selectedEmail.createdAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}
                            </div>
                            <div className="prose prose-invert prose-blue max-w-none text-gray-300 leading-relaxed text-sm">
                                {selectedEmail.html ? (
                                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                                ) : (
                                    <p className="whitespace-pre-wrap font-sans">{selectedEmail.text}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white/[0.02]">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Send className="w-8 h-8 opacity-40" />
                        </div>
                        <p className="text-base font-medium text-gray-400">Select an email to view</p>
                        <p className="text-sm text-gray-600 mt-2">Nothing selected</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sent;
