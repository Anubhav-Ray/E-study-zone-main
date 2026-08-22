import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
    MessageSquare, Send, CheckCircle2, Clock, 
    Loader2, User, ChevronDown, ChevronUp, Sparkles,
    AlertCircle, MessageCircle, HelpCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Avatar } from '../components/ui/Avatar';

const QuerySection = () => {
    const { userInfo } = useAuth();
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connections, setConnections] = useState([]);
    const [activeQuery, setActiveQuery] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [newQuery, setNewQuery] = useState({ trainerId: '', question: '' });
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'unresolved' | 'resolved'

    const isStudent = ['student', 'learner'].includes(userInfo?.role);
    const isTrainer = ['trainer', 'faculty'].includes(userInfo?.role);

    const fetchData = async () => {
        try {
            const endpoint = isTrainer ? '/queries/trainer' : '/queries/learner';
            const [qRes, cRes] = await Promise.all([
                api.get(endpoint),
                isStudent ? api.get('/handshakes/my-connections') : Promise.resolve({ data: [] })
            ]);
            setQueries(qRes.data);
            setConnections(cRes.data);
        } catch (_error) {
            toast.error('Failed to load query feed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!newQuery.trainerId) return toast.error('Please select a connected mentor first');
        if (!newQuery.question.trim()) return toast.error('Please describe your query');
        try {
            await api.post('/queries', newQuery);
            toast.success('Query submitted to mentor!');
            setNewQuery({ trainerId: '', question: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send query');
        }
    };

    const handleAnswer = async (id) => {
        if (!answerText.trim()) return toast.error('Please enter an answer');
        try {
            await api.put(`/queries/${id}`, { answer: answerText, status: 'resolved' });
            toast.success('Response delivered to student!');
            setAnswerText('');
            setActiveQuery(null);
            fetchData();
        } catch (_error) {
            toast.error('Failed to submit answer');
        }
    };

    const filteredQueries = queries.filter(q => {
        if (filterStatus === 'all') return true;
        return q.status === filterStatus;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-zinc-400 text-sm font-medium">Loading doubt resolution channel...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
            {/* Header */}
            <header className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="primary" size="sm" icon={HelpCircle}>
                            Doubt Resolution Hub
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">{queries.length} Total Tickets</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                        Academic Queries & Doubts
                    </h1>
                    <p className="mt-1 text-zinc-400 text-sm">
                        Collaborate directly with assigned mentors, ask technical questions, and resolve coursework hurdles.
                    </p>
                </div>
            </header>

            {/* Ask Query Form for Students */}
            {isStudent && (
                <Card className="p-6 border-indigo-500/30 bg-zinc-900/90 shadow-xl">
                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-zinc-800">
                        <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                            <Send className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Submit New Doubt Ticket</CardTitle>
                            <CardDescription>Direct your query to any of your connected mentors.</CardDescription>
                        </div>
                    </div>

                    <form onSubmit={handleAsk} className="space-y-4">
                        <Select
                            label="Select Connected Mentor"
                            required
                            placeholder="Choose an active mentor connection..."
                            value={newQuery.trainerId}
                            onChange={(e) => setNewQuery({ ...newQuery, trainerId: e.target.value })}
                            options={connections.map((c) => ({
                                value: c.trainerId?._id,
                                label: `${c.trainerId?.name} (${c.trainerId?.email})`
                            }))}
                        />

                        {!connections.length && (
                            <p className="text-xs text-amber-400">
                                You don't have any accepted mentor connections yet. Visit <a href="/find-trainers" className="underline font-bold">Find Trainers</a> to connect.
                            </p>
                        )}

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                Describe Your Doubt / Question
                            </label>
                            <textarea
                                required
                                className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 transition h-28"
                                placeholder="Explain the problem or code block you are struggling with..."
                                value={newQuery.question}
                                onChange={(e) => setNewQuery({ ...newQuery, question: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end pt-1">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={!connections.length}
                                icon={Send}
                            >
                                Send Question Ticket
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Query History Feed */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-zinc-100">Query Tickets History</h3>
                    <div className="flex items-center gap-1.5">
                        {['all', 'unresolved', 'resolved'].map((st) => (
                            <button
                                key={st}
                                type="button"
                                onClick={() => setFilterStatus(st)}
                                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition ${
                                    filterStatus === st
                                        ? 'bg-zinc-800 text-white border border-zinc-700'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredQueries.map((q) => (
                        <Card key={q._id} className="p-6 overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
                                <div className="flex items-center space-x-3">
                                    <Avatar 
                                        name={isTrainer ? q.learnerId?.name : q.trainerId?.name} 
                                        size="sm" 
                                    />
                                    <div>
                                        <p className="font-bold text-sm text-zinc-100">
                                            {isTrainer ? q.learnerId?.name : q.trainerId?.name}
                                        </p>
                                        <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(q.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <Badge 
                                    variant={q.status === 'resolved' ? 'success' : 'warning'} 
                                    size="sm"
                                    icon={q.status === 'resolved' ? CheckCircle2 : Clock}
                                >
                                    {q.status}
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-sm text-zinc-200">
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                                        Question:
                                    </span>
                                    {q.question}
                                </div>

                                {q.answer && (
                                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-200">
                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                                            Mentor Response:
                                        </span>
                                        {q.answer}
                                    </div>
                                )}
                            </div>

                            {/* Mentor Response Form */}
                            {isTrainer && q.status === 'unresolved' && (
                                <div className="mt-4 pt-4 border-t border-zinc-800">
                                    {activeQuery === q._id ? (
                                        <div className="space-y-3">
                                            <textarea
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500 transition h-24"
                                                placeholder="Write your explanation or code solution..."
                                                value={answerText}
                                                onChange={(e) => setAnswerText(e.target.value)}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Button 
                                                    variant="success" 
                                                    size="sm"
                                                    onClick={() => handleAnswer(q._id)}
                                                >
                                                    Submit Response
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => setActiveQuery(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setActiveQuery(q._id)}
                                            icon={MessageSquare}
                                        >
                                            Respond to Doubt
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}

                    {filteredQueries.length === 0 && (
                        <div className="p-16 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-sm">
                            No query tickets found in this category.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuerySection;
