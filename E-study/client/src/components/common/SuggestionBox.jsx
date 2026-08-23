import React, { useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { MessageSquare, Send, Loader2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

const SuggestionBox = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setLoading(true);
        try {
            await api.post('/suggestions', { message });
            toast.success('Feedback received! Thank you for helping us improve.');
            setMessage('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-indigo-500/20 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-indigo-950/20 mt-8">
            <CardHeader>
                <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Campus Suggestion & Feedback Box</CardTitle>
                        <CardDescription>
                            Have a feature request, curriculum improvement idea, or feedback for the administration? Let us know.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input 
                        required
                        type="text" 
                        className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
                        placeholder="Type your suggestion or feedback here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button 
                        type="submit" 
                        variant="secondary" 
                        loading={loading}
                        icon={Send}
                        className="sm:w-auto w-full"
                    >
                        Submit Feedback
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default SuggestionBox;
