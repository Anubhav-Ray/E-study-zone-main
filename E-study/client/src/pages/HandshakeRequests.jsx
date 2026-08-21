import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Check, X, User, MessageSquare, Loader2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HandshakeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await api.get('/handshakes/my-requests');
                setRequests(data);
            } catch (error) {
                toast.error('Failed to load requests');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await api.put(`/handshakes/${id}`, { status });
            setRequests(requests.filter(r => r._id !== id));
            toast.success(`Request ${status === 'accepted' ? 'Accepted' : 'Rejected'}`);
        } catch (error) {
            toast.error('Action failed');
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h2 className="text-4xl font-extrabold mb-2">Connection Requests</h2>
                <p className="text-slate-400">Learners who want to connect with you for study materials.</p>
            </header>

            <div className="space-y-4">
                <AnimatePresence>
                    {requests.length > 0 ? requests.map((req) => (
                        <motion.div 
                            key={req._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-primary/20 p-3 rounded-full">
                                    <User className="text-primary-light" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">{req.learnerId.name}</h4>
                                    <p className="text-slate-400 text-sm italic">Interests: {req.learnerId.learnerProfile?.interests?.join(', ')}</p>
                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                        <Clock size={12} className="mr-1" />
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={() => handleAction(req._id, 'rejected')}
                                    className="px-4 py-2 border border-slate-700 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition flex items-center space-x-2"
                                >
                                    <X size={18} />
                                    <span>Reject</span>
                                </button>
                                <button 
                                    onClick={() => handleAction(req._id, 'accepted')}
                                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center space-x-2 shadow-lg shadow-emerald-900/20"
                                >
                                    <Check size={18} />
                                    <span>Accept</span>
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
                            <p className="text-slate-500">No pending requests at the moment.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HandshakeRequests;
