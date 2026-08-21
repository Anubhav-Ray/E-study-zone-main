import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
    Users, BookOpen, MessageCircle, Settings, 
    ArrowRight, Star, Clock, FileText, PlusCircle, Trash2, ClipboardPenLine, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SuggestionBox from '../components/common/SuggestionBox';

const Dashboard = () => {
    const { userInfo } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (['admin', 'super_admin'].includes(userInfo.role)) {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            }
        };
        fetchStats();
    }, [userInfo]);

    if (['admin', 'super_admin'].includes(userInfo.role)) return <AdminDashboard stats={stats} isSuperAdmin={userInfo.role === 'super_admin'} />;
    if (['trainer', 'faculty'].includes(userInfo.role)) return <TrainerDashboard />;
    return <LearnerDashboard />;
};

const AdminDashboard = ({ stats, isSuperAdmin }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={<Users />} title="Total Users" value={stats?.users} color="bg-blue-600" />
            <StatCard icon={<BookOpen />} title="Materials" value={stats?.materials} color="bg-emerald-600" />
            <StatCard icon={<MessageCircle />} title="Queries" value={stats?.queries} color="bg-amber-600" />
            <StatCard icon={<Users />} title="Trainers" value={stats?.trainers} color="bg-purple-600" />
            <StatCard icon={<Users />} title="Learners" value={stats?.learners} color="bg-pink-600" />
            <StatCard icon={<FileText />} title="Suggestions" value={stats?.suggestions} color="bg-slate-600" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/admin" className="flex items-center space-x-3 p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-500 transition">
                        <Users className="text-blue-400" />
                        <span>Manage Users</span>
                    </Link>
                    <Link to="/library" className="flex items-center space-x-3 p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-500 transition">
                        <FileText className="text-emerald-400" />
                        <span>All Materials</span>
                    </Link>
                    <Link to="/academic-setup" className="flex items-center space-x-3 p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-500 transition">
                        <Settings className="text-pink-400" />
                        <span>Academic Setup</span>
                    </Link>
                    {isSuperAdmin && <Link to="/admin-management" className="flex items-center space-x-3 p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-500 transition">
                        <Shield className="text-amber-300" />
                        <span>Admin Management</span>
                    </Link>}
                </div>
            </div>
        </div>
    </div>
);

const TrainerDashboard = () => (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Faculty Dashboard</h2>
            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition shadow-lg">
                <PlusCircle className="w-5 h-5" />
                <span>Upload Material</span>
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard icon={<ClipboardPenLine />} title="Academic Manager" description="Mark daily attendance and publish student assessment marks." label="Open Manager" color="text-pink-400" link="/academic-manager" />
            <ActionCard icon={<Clock />} title="Active Queries" description="You have unanswered queries from your learners." label="View Queries" color="text-amber-400" link="/queries" />
            <ActionCard icon={<Users />} title="New Handshakes" description="Manage learners who want to connect." label="Requests" color="text-blue-400" link="/requests" />
            <ActionCard icon={<BookOpen />} title="My Library" description="Manage your uploaded study materials." label="Manage" color="text-emerald-400" link="/library" />
        </div>
        <SuggestionBox />
    </div>
);

const LearnerDashboard = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold">Student Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">Academic Progress</h3>
                <p className="text-slate-400 mb-6">See subject-wise attendance, assessment marks, alerts, and your student health score.</p>
                <Link to="/academic-statistics" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition inline-flex items-center space-x-2 w-fit">
                    <span>View Statistics</span>
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">Find Your Mentor</h3>
                <p className="text-slate-400 mb-6">Discovery trainers that match your IT interest areas and start learning today.</p>
                <Link to="/find-trainers" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition inline-flex items-center space-x-2 w-fit">
                    <span>Explore Trainers</span>
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                    <BookOpen className="w-24 h-24" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Knowledge Base</h3>
                <p className="text-slate-400 mb-6">Access study materials from connected trainers and download for offline study.</p>
                <Link to="/library" className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-xl font-bold transition inline-flex items-center space-x-2 w-fit">
                    <span>My Library</span>
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
        <SuggestionBox />
    </div>
);

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl text-center">
        <div className={`${color} p-2 rounded-lg w-fit mx-auto mb-2 text-white`}>{icon}</div>
        <div className="text-slate-400 text-xs font-medium uppercase">{title}</div>
        <div className="text-2xl font-bold mt-1">{value || 0}</div>
    </div>
);

const ActionCard = ({ icon, title, description, label, color, link }) => (
    <Link to={link || "#"} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl hover:border-slate-500 transition group block">
        <div className={`${color} mb-4 group-hover:scale-110 transition shrink-0`}>
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-slate-400 mb-6 text-sm">{description}</p>
        <div className="text-primary-light font-semibold hover:underline flex items-center space-x-1">
            <span>{label}</span>
            <ArrowRight size={16} />
        </div>
    </Link>
);

export default Dashboard;
