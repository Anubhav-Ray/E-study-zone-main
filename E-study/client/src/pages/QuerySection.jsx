import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MessageSquare, Send, CheckCircle2, Clock, Loader2, User, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuerySection = () => {
    const { userInfo } = useAuth();
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connections, setConnections] = useState([]); // For learners to pick a trainer
    const [activeQuery, setActiveQuery] = useState(null); // For trainers to answer
    const [answerText, setAnswerText] = useState('');
    const [newQuery, setNewQuery] = useState({ trainerId: '', question: '' });

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    const fetchData = async () => {
        try {
            const endpoint = userInfo.role === 'trainer' ? '/queries/trainer' : '/queries/learner';
            const [qRes, cRes] = await Promise.all([
                api.get(endpoint),
                userInfo.role === 'learner' ? api.get('/handshakes/my-connections') : Promise.resolve({ data: [] })
            ]);
            setQueries(qRes.data);
            setConnections(cRes.data);
        } catch (error) {
            toast.error('Failed to load queries');
        } finally {
            setLoading(false);
        }
    };

    const handleAsk = async (e) => {
        e.preventDefault();
        try {
            await api.post('/queries', newQuery);
            toast.success('Query Sent!');
            setNewQuery({ trainerId: '', question: '' });
            fetchData();
        } catch (error) {
            toast.error('Failed to send query');
        }
    };

    const handleAnswer = async (id) => {
        try {
            await api.put(`/queries/${id}`, { answer: answerText, status: 'resolved' });
            toast.success('Response Sent!');
            setAnswerText('');
            setActiveQuery(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to respond');
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <header>
                <h2 className="text-4xl font-extrabold mb-2">Query Center</h2>
                <p className="text-slate-400">Collaborate and resolve doubts in real-time.</p>
            </header>

            {userInfo.role === 'learner' && (
                <section className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                        <Send size={24} className="text-primary-light" />
                        <span>Ask New Query</span>
                    </h3>
                    <form onSubmit={handleAsk} className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-400 block mb-1">Select Connected Trainer</label>
                            <select 
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:border-primary outline-none transition"
                                value={newQuery.trainerId}
                                onChange={e => setNewQuery({...newQuery, trainerId: e.target.value})}
                            >
                                <option value="">Choose a trainer...</option>
                                {connections.map(c => (
                                    <option key={c.trainerId._id} value={c.trainerId._id}>{c.trainerId.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-1">Your Question</label>
                            <textarea 
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 h-24 focus:border-primary outline-none transition"
                                placeholder="Describe your doubt here..."
                                value={newQuery.question}
                                onChange={e => setNewQuery({...newQuery, question: e.target.value})}
                            />
                        </div>
                        <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition flex items-center space-x-2">
                            <span>Shoot Question</span>
                            <Send size={18} />
                        </button>
                    </form>
                </section>
            )}

            <section className="space-y-6">
                <h3 className="text-2xl font-bold">Query History</h3>
                <div className="space-y-4">
                    {queries.map(q => (
                        <div key={q._id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                            <div className={`p-6 ${q.status === 'resolved' ? 'border-l-4 border-emerald-500' : 'border-l-4 border-amber-500'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-slate-700 p-2 rounded-full">
                                            <User size={20} className="text-slate-300" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{userInfo.role === 'trainer' ? q.learnerId.name : q.trainerId.name}</p>
                                            <p className="text-xs text-slate-500">{new Date(q.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${q.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {q.status}
                                    </span>
                                </div>
                                <h4 className="text-lg font-semibold mb-4 text-slate-200">Q: {q.question}</h4>
                                
                                {q.answer && (
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 mt-4">
                                        <p className="text-xs font-bold text-primary-light mb-1 uppercase tracking-widest">Trainer Response</p>
                                        <p className="text-slate-300 italic">{q.answer}</p>
                                    </div>
                                )}

                                {userInfo.role === 'trainer' && q.status === 'unresolved' && (
                                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                                        {activeQuery === q._id ? (
                                            <div className="space-y-4">
                                                <textarea 
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 h-24"
                                                    placeholder="Write your answer..."
                                                    value={answerText}
                                                    onChange={e => setAnswerText(e.target.value)}
                                                />
                                                <div className="flex space-x-3">
                                                    <button onClick={() => handleAnswer(q._id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl transition font-bold">Submit Answer</button>
                                                    <button onClick={() => setActiveQuery(null)} className="text-slate-400 px-6 py-2">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setActiveQuery(q._id)}
                                                className="text-primary-light font-bold flex items-center space-x-1 hover:underline"
                                            >
                                                <MessageSquare size={18} className="mr-1" />
                                                <span>Respond Now</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {queries.length === 0 && (
                        <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
                            <p className="text-slate-500">No queries found.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default QuerySection;
