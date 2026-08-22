import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
    LogIn, Mail, Lock, Loader2, GraduationCap, 
    School, ShieldCheck, ArrowRight, Sparkles 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState('student');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Signed in successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials or login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[75vh] py-10 px-4">
            <div className="w-full max-w-md">
                <Card className="p-8 border-indigo-500/30 bg-zinc-900/80 shadow-2xl backdrop-blur-2xl">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-600 text-white shadow-lg shadow-indigo-600/30 mb-4">
                            <LogIn className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">Welcome Back</h2>
                        <p className="text-zinc-400 text-xs mt-1">Sign in to your CampusSphere unified portal</p>
                    </div>

                    {/* Role Tab Buttons */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setLoginType('student')}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-bold transition-all ${
                                loginType === 'student'
                                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-sm'
                                    : 'border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                            }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span>Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginType('faculty')}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-bold transition-all ${
                                loginType === 'faculty'
                                    ? 'border-pink-500 bg-pink-500/15 text-pink-300 shadow-sm'
                                    : 'border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                            }`}
                        >
                            <School className="w-4 h-4" />
                            <span>Faculty</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginType('admin')}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-bold transition-all ${
                                loginType === 'admin'
                                    ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-sm'
                                    : 'border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                            }`}
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            icon={Mail}
                            placeholder="name@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            label="Password"
                            type="password"
                            required
                            icon={Lock}
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg"
                            className="w-full justify-center" 
                            loading={loading}
                            icon={LogIn}
                        >
                            Sign In to Portal
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-zinc-800 text-center space-y-2 text-xs text-zinc-400">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-400 font-bold hover:underline">
                                Create an account
                            </Link>
                        </p>
                        {loginType === 'admin' && (
                            <p className="text-amber-400/90 pt-1">
                                Need admin onboarding?{' '}
                                <Link to="/admin-register" className="underline font-bold">
                                    Register with private access code
                                </Link>
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
