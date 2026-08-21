import React, { useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

const SuggestionBox = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/suggestions', { message });
            toast.success('Suggestion Received! Thank you.');
            setMessage('');
        } catch (error) {
            toast.error('Failed to submit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mt-10">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <MessageSquare className="text-secondary" />
                <span>Suggestion Box</span>
            </h3>
            <p className="text-sm text-slate-400 mb-4">Share your feedback or suggest features to the administrator.</p>
            <form onSubmit={handleSubmit} className="flex gap-4">
                <input 
                    required
                    type="text" 
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 focus:border-secondary outline-none transition"
                    placeholder="Wite your suggestion here..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button disabled={loading} className="bg-secondary hover:bg-secondary-dark text-white px-6 rounded-xl transition flex items-center space-x-2">
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                </button>
            </form>
        </section>
    );
};

export default SuggestionBox;
