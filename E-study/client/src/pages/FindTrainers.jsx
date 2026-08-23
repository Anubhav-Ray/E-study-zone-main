import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import TrainerCard from '../components/trainer/TrainerCard';
import { Search, Filter, Loader2, Sparkles, Users, Award, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

const FindTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [matchingTrainers, setMatchingTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sentRequests, setSentRequests] = useState([]);
    const [connectedTrainers, setConnectedTrainers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allRes, matchRes, connRes] = await Promise.all([
                    api.get('/users/trainers'),
                    api.get('/users/trainers/match'),
                    api.get('/handshakes/my-connections')
                ]);
                setTrainers(allRes.data);
                setMatchingTrainers(matchRes.data);
                setConnectedTrainers(connRes.data.map(c => c.trainerId?._id));
            } catch (_error) {
                toast.error('Failed to load mentors');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleConnect = async (trainerId) => {
        try {
            await api.post(`/handshakes/request/${trainerId}`);
            setSentRequests([...sentRequests, trainerId]);
            toast.success('Connection handshake request sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send request');
        }
    };

    const filteredTrainers = trainers.filter(t => 
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.trainerProfile?.expertise?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-zinc-400 text-sm font-medium">Matching mentor directory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-16">
            {/* Header */}
            <header className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="primary" size="sm" icon={Users}>
                            Mentorship Network
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">{trainers.length} Verified Mentors</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                        Find Academic & Industry Mentors
                    </h1>
                    <p className="mt-1 text-zinc-400 text-sm">
                        Connect with faculty and technology mentors matching your domain of interest for 1-on-1 guidance.
                    </p>
                </div>

                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search by mentor name or skill..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-indigo-500 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* AI Recommended Mentors */}
            {matchingTrainers.length > 0 && !searchTerm && (
                <section className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-100">Recommended for Your Interests</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matchingTrainers.map(trainer => (
                            <TrainerCard 
                                key={trainer._id} 
                                trainer={trainer} 
                                onConnect={handleConnect}
                                isPending={sentRequests.includes(trainer._id)}
                                isConnected={connectedTrainers.includes(trainer._id)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* All Trainers Directory */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-zinc-100">
                        {searchTerm ? `Search Results (${filteredTrainers.length})` : 'All Faculty & Mentors'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrainers.map(trainer => (
                        <TrainerCard 
                            key={trainer._id} 
                            trainer={trainer} 
                            onConnect={handleConnect}
                            isPending={sentRequests.includes(trainer._id)}
                            isConnected={connectedTrainers.includes(trainer._id)}
                        />
                    ))}
                </div>

                {filteredTrainers.length === 0 && (
                    <div className="p-16 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-sm">
                        No mentors found matching "{searchTerm}". Try searching for another skill like React, Python, or Algorithms.
                    </div>
                )}
            </section>
        </div>
    );
};

export default FindTrainers;
