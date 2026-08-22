import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
    UserPlus, Mail, Lock, User, GraduationCap, 
    School, Loader2, ShieldCheck, ArrowRight, Sparkles 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            toast.success('Registration successful! Welcome to CampusSphere.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-10 px-4">
            <div className="w-full max-w-lg">
                <Card className="p-8 border-pink-500/30 bg-zinc-900/80 shadow-2xl backdrop-blur-2xl">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 text-white shadow-lg shadow-pink-600/30 mb-4">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">Create Your Account</h2>
                        <p className="text-zinc-400 text-xs mt-1">Join the campus network of students, faculty, and mentors</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'student' })}
                                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all ${
                                    formData.role === 'student'
                                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-sm'
                                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                <GraduationCap className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-wider">Student Account</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'faculty' })}
                                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all ${
                                    formData.role === 'faculty'
                                        ? 'border-pink-500 bg-pink-500/15 text-pink-300 shadow-sm'
                                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                <School className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-wider">Faculty Account</span>
                            </button>
                        </div>

                        {/* Admin Onboarding Link */}
                        <Link 
                            to="/admin-register" 
                            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Administrator account? Register with secret code &rarr;</span>
                        </Link>

                        <Input
                            label="Full Name"
                            name="name"
                            required
                            icon={User}
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <Input
                            label="Institutional Email"
                            name="email"
                            type="email"
                            required
                            icon={Mail}
                            placeholder="student@university.edu"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            label="Create Password"
                            name="password"
                            type="password"
                            required
                            icon={Lock}
                            placeholder="••••••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <Button
                            type="submit"
                            variant={formData.role === 'faculty' ? 'secondary' : 'primary'}
                            size="lg"
                            className="w-full justify-center mt-2"
                            loading={loading}
                            icon={UserPlus}
                        >
                            Complete Registration
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-400">
                        Already registered?{' '}
                        <Link to="/login" className="text-indigo-400 font-bold hover:underline">
                            Sign in to your account
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;
