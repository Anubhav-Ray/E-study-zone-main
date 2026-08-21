import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Loader2, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
            toast.success('Admin account created successfully');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to create admin account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-800/60 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 w-fit rounded-full bg-amber-400/15 p-4"><ShieldCheck className="h-8 w-8 text-amber-300" /></div>
                    <h2 className="text-3xl font-bold">Register Administrator</h2>
                    <p className="mt-2 text-slate-400">Create a college administrator account using the private access code issued by your institution.</p>
                </div>
                <form onSubmit={submit} className="space-y-5">
                    <Input icon={<User />} label="Full name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="Arpit Rai" />
                    <Input icon={<Mail />} label="Email address" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} placeholder="admin@college.edu" />
                    <Input icon={<Lock />} label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} placeholder="Create a strong password" />
                    <Input icon={<KeyRound />} label="Admin access code" type="password" value={form.accessCode} onChange={(value) => setForm({ ...form, accessCode: value })} placeholder="Code provided by the college" />
                    <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50">{loading ? <Loader2 className="animate-spin" size={19} /> : <ShieldCheck size={19} />}{loading ? 'Creating account…' : 'Create Admin Account'}</button>
                </form>
                <p className="mt-7 text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="text-primary-light hover:underline">Log in</Link></p>
            </motion.div>
        </div>
    );
};

const Input = ({ icon, label, value, onChange, ...props }) => <label className="block text-sm font-medium text-slate-300">{label}<span className="relative mt-2 block"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">{React.cloneElement(icon, { size: 18 })}</span><input required value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 pl-10 text-white outline-none transition focus:border-amber-400" {...props} /></span></label>;

export default AdminRegister;
