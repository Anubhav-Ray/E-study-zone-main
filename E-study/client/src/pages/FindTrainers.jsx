import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import TrainerCard from '../components/trainer/TrainerCard';
import { Search, Filter, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FindTrainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [matchingTrainers, setMatchingTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sentRequests, setSentRequests] = useState([]);

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
                // In a real app, I'd also fetch pending requests to disable buttons
            } catch (error) {
                toast.error('Failed to load trainers');
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
            toast.success('Connection request sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send request');
        }
    };

    const filteredTrainers = trainers.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.trainerProfile?.expertise?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold mb-2">Find Trainers</h2>
                    <p className="text-slate-400">Discover and connect with experts in your interest areas.</p>
                </div>
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search by name or technology..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 p-3 focus:border-primary outline-none transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {matchingTrainers.length > 0 && !searchTerm && (
                <section>
                    <div className="flex items-center space-x-2 mb-6">
                        <Sparkles className="text-amber-400 fill-amber-400" />
                        <h3 className="text-2xl font-bold">Recommended for You</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matchingTrainers.map(trainer => (
                            <TrainerCard 
                                key={trainer._id} 
                                trainer={trainer} 
                                onConnect={handleConnect}
                                isPending={sentRequests.includes(trainer._id)}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h3 className="text-2xl font-bold mb-6">{searchTerm ? `Search Results (${filteredTrainers.length})` : 'All Trainers'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrainers.map(trainer => (
                        <TrainerCard 
                            key={trainer._id} 
                            trainer={trainer} 
                            onConnect={handleConnect}
                            isPending={sentRequests.includes(trainer._id)}
                        />
                    ))}
                </div>
                {filteredTrainers.length === 0 && (
                    <div className="text-center py-20 bg-slate-800/50 rounded-3xl border border-slate-700">
                        <p className="text-slate-400">No trainers found matching your search.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default FindTrainers;
