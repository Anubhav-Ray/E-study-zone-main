import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Loader2, Lock, Mail, ShieldCheck, User, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const AdminRegister = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', accessCode: '' });
    const [loading, setLoading] = useState(false);
    const { registerAdmin } = useAuth();
    const navigate = useNavigate();

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await registerAdmin(form);
            toast.success('Admin account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to create admin account. Verify access code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-10 px-4">
            <div className="w-full max-w-lg">
                <Card className="p-8 border-amber-500/30 bg-zinc-900/80 shadow-2xl backdrop-blur-2xl">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 w-fit rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/30 p-3.5 shadow-lg shadow-amber-500/10">
                            <ShieldCheck className="h-7 w-7" />
                        </div>
                        <Badge variant="warning" size="sm" className="mb-2">Admin Onboarding</Badge>
                        <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">Register Administrator</h2>
                        <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
                            Requires a secure cryptographic access code issued by college leadership.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <Input 
                            icon={User} 
                            label="Full Name" 
                            required
                            value={form.name} 
                            onChange={(e) => setForm({ ...form, name: e.target.value })} 
                            placeholder="Dr. Arpit Rai" 
                        />
                        <Input 
                            icon={Mail} 
                            label="Official Institutional Email" 
                            type="email" 
                            required
                            value={form.email} 
                            onChange={(e) => setForm({ ...form, email: e.target.value })} 
                            placeholder="admin@college.edu" 
                        />
                        <Input 
                            icon={Lock} 
                            label="Master Password" 
                            type="password" 
                            required
                            value={form.password} 
                            onChange={(e) => setForm({ ...form, password: e.target.value })} 
                            placeholder="Create a strong password" 
                        />
                        <Input 
                            icon={KeyRound} 
                            label="Private Admin Access Code" 
                            type="password" 
                            required
                            value={form.accessCode} 
                            onChange={(e) => setForm({ ...form, accessCode: e.target.value })} 
                            placeholder="Enter institutional clearance code" 
                        />

                        <Button 
                            type="submit" 
                            variant="warning" 
                            size="lg"
                            className="w-full justify-center text-zinc-950 font-bold mt-2" 
                            loading={loading}
                            icon={ShieldCheck}
                        >
                            Verify Clearance & Create Admin
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-xs text-zinc-400 pt-4 border-t border-zinc-800">
                        Already have credentials? <Link to="/login" className="text-indigo-400 font-bold hover:underline">Sign in</Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default AdminRegister;
