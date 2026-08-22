import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Check, X, User, MessageSquare, Loader2, Clock, Users, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';

const HandshakeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await api.get('/handshakes/my-requests');
                setRequests(data);
            } catch (_error) {
                toast.error('Failed to load connection requests');
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
            toast.success(`Mentorship request ${status === 'accepted' ? 'Accepted' : 'Declined'}`);
        } catch (_error) {
            toast.error('Action failed');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-zinc-400 text-sm font-medium">Checking incoming handshakes...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
            {/* Header */}
            <header className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="secondary" size="sm" icon={Users}>
                            Mentorship Gateway
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">{requests.length} Pending Handshakes</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                        Mentorship Handshake Requests
                    </h1>
                    <p className="mt-1 text-zinc-400 text-sm">
                        Students who have requested your 1-on-1 academic mentorship and study material access.
                    </p>
                </div>
            </header>

            <div className="space-y-4">
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <div key={req._id}>
                            <Card className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-500/40">
                                <div className="flex items-center space-x-4">
                                    <Avatar name={req.learnerId?.name} size="lg" />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h4 className="text-lg font-bold text-zinc-100">{req.learnerId?.name}</h4>
                                            <Badge variant="primary" size="sm">Student</Badge>
                                        </div>
                                        <p className="text-zinc-400 text-xs mt-0.5">{req.learnerId?.email}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className="text-[11px] font-semibold text-zinc-400">Interests:</span>
                                            {req.learnerId?.learnerProfile?.interests?.length ? (
                                                req.learnerId.learnerProfile.interests.map((int, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-950 text-[10px] text-zinc-300 border border-zinc-800">
                                                        {int}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-zinc-500 italic">Not specified</span>
                                            )}
                                        </div>
                                        <div className="flex items-center text-[11px] text-zinc-500 mt-2">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Requested on {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 self-end md:self-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAction(req._id, 'rejected')}
                                        icon={X}
                                        className="text-zinc-400 hover:text-red-400"
                                    >
                                        Decline
                                    </Button>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleAction(req._id, 'accepted')}
                                        icon={Check}
                                    >
                                        Accept Handshake
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="p-16 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-sm">
                        No pending mentorship requests at the moment.
                    </div>
                )}
            </div>
        </div>
    );
};

export default HandshakeRequests;
