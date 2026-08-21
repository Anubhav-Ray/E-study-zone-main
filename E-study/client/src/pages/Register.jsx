import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, GraduationCap, School, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

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
            const data = await register(formData);
            console.log(data);

            toast.success('Registration Successful!');
            navigate('/dashboard');
        } catch (error) {
            console.log(error);

            toast.error(error.response?.data?.message || 'Registration Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 w-full max-w-lg backdrop-blur-xl shadow-2xl"
            >
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="bg-secondary/20 p-4 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-bold">Create Account</h2>
                    <p className="text-slate-400 mt-2">Join our global community of learners and trainers</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'student' })}
                            className={`flex flex-col items-center p-4 rounded-xl border transition ${formData.role === 'student' ? 'bg-primary/20 border-primary text-primary-light' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                        >
                            <GraduationCap className="w-6 h-6 mb-2" />
                            <span className="font-medium">Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'faculty' })}
                            className={`flex flex-col items-center p-4 rounded-xl border transition ${formData.role === 'faculty' ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                        >
                            <School className="w-6 h-6 mb-2" />
                            <span className="font-medium">Faculty</span>
                        </button>
                    </div>

                    <Link to="/admin-register" className="flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm font-bold text-amber-200 transition hover:bg-amber-400/20">
                        <ShieldCheck size={18} />
                        Register Administrator (access code required)
                    </Link>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                                <User className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-slate-900 border border-slate-700 text-white rounded-xl block w-full pl-10 p-3 focus:ring-primary focus:border-primary transition outline-none"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                                <Mail className="w-5 h-5" />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-slate-900 border border-slate-700 text-white rounded-xl block w-full pl-10 p-3 focus:ring-primary focus:border-primary transition outline-none"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-slate-900 border border-slate-700 text-white rounded-xl block w-full pl-10 p-3 focus:ring-primary focus:border-primary transition outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-bold py-3 px-4 rounded-xl transition flex justify-center items-center space-x-2 ${formData.role === 'faculty' ? 'bg-secondary hover:bg-secondary-dark' : 'bg-primary hover:bg-primary-dark'} text-white shadow-xl`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign Up</span>}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-8">
                    Already have an account? <Link to="/login" className="text-primary-light hover:underline">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
