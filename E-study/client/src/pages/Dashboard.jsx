import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
    Users, BookOpen, MessageCircle, Settings, 
    ArrowRight, Star, Clock, FileText, PlusCircle, 
    ClipboardPenLine, Shield, UserCheck, HeartPulse, 
    BarChart3, Sparkles, AlertTriangle, CheckCircle2, ChevronRight,
    School, GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SuggestionBox from '../components/common/SuggestionBox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';

const Dashboard = () => {
    const { userInfo } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (['admin', 'super_admin'].includes(userInfo?.role)) {
                try {
                    const { data } = await api.get('/admin/stats');
                    setStats(data);
                } catch (e) {
                    console.error('Stats fetch error', e);
                }
            }
        };
        fetchStats();
    }, [userInfo]);

    if (['admin', 'super_admin'].includes(userInfo?.role)) {
        return <AdminDashboard stats={stats} isSuperAdmin={userInfo?.role === 'super_admin'} user={userInfo} />;
    }
    if (['trainer', 'faculty'].includes(userInfo?.role)) {
        return <TrainerDashboard user={userInfo} />;
    }
    return <LearnerDashboard user={userInfo} />;
};

const AdminDashboard = ({ stats, isSuperAdmin, user }) => (
    <div className="space-y-8 pb-12">
        {/* Top Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
                <div className="flex items-center space-x-2.5 mb-1">
                    <Badge variant="warning" size="sm" icon={Shield}>
                        {isSuperAdmin ? 'Super Administrator' : 'Administrator'}
                    </Badge>
                    <span className="text-xs text-zinc-500 font-mono">System Active</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                    Welcome back, {user?.name || 'Administrator'}
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Complete institutional overview, user rosters, department architecture, and live statistics.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/academic-setup">
                    <Button variant="primary" icon={Settings}>
                        Academic Setup
                    </Button>
                </Link>
                <Link to="/admin">
                    <Button variant="outline" icon={Users}>
                        Manage Users
                    </Button>
                </Link>
            </div>
        </div>

        {/* 6 Metric Stat Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={Users} title="Total Users" value={stats?.users} color="indigo" delta="+12%" />
            <StatCard icon={BookOpen} title="Materials" value={stats?.materials} color="emerald" delta="+5" />
            <StatCard icon={MessageCircle} title="Queries" value={stats?.queries} color="amber" />
            <StatCard icon={School} title="Faculty" value={stats?.trainers} color="purple" />
            <StatCard icon={GraduationCap} title="Students" value={stats?.learners} color="pink" />
            <StatCard icon={FileText} title="Suggestions" value={stats?.suggestions} color="blue" />
        </div>

        {/* Quick Actions Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-6">
                <CardTitle className="text-lg mb-1">Administrative Operations Hub</CardTitle>
                <CardDescription className="mb-6">Direct access to core university setup, departments, and security management.</CardDescription>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/admin" className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-indigo-500/50 hover:bg-zinc-900 transition group flex items-start space-x-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition-transform">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-300 transition">User Management</h4>
                            <p className="text-xs text-zinc-400 mt-0.5">View, filter, or remove student and faculty accounts.</p>
                        </div>
                    </Link>

                    <Link to="/academic-setup" className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-pink-500/50 hover:bg-zinc-900 transition group flex items-start space-x-3">
                        <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30 group-hover:scale-105 transition-transform">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-zinc-100 group-hover:text-pink-300 transition">Academic Setup</h4>
                            <p className="text-xs text-zinc-400 mt-0.5">Create departments, courses, subjects, and assign enrollments.</p>
                        </div>
                    </Link>

                    <Link to="/library" className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-emerald-500/50 hover:bg-zinc-900 transition group flex items-start space-x-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-300 transition">Study Library</h4>
                            <p className="text-xs text-zinc-400 mt-0.5">Audit uploaded lecture materials, lab manuals, and PDFs.</p>
                        </div>
                    </Link>

                    {isSuperAdmin && (
                        <Link to="/admin-management" className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60 hover:bg-amber-500/10 transition group flex items-start space-x-3">
                            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 group-hover:scale-105 transition-transform">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-amber-200">Admin Governance</h4>
                                <p className="text-xs text-zinc-400 mt-0.5">Control administrator permissions, promotions, and audit trails.</p>
                            </div>
                        </Link>
                    )}
                </div>
            </Card>

            {/* System Status Panel */}
            <Card className="p-6 flex flex-col justify-between">
                <div>
                    <CardTitle className="text-lg mb-1">System Health</CardTitle>
                    <CardDescription className="mb-6">CampusSphere ERP core services & database telemetry.</CardDescription>
                    
                    <div className="space-y-4 text-xs">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                            <span className="text-zinc-300 font-medium">Academic Engine</span>
                            <Badge variant="success" size="sm">Operational</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                            <span className="text-zinc-300 font-medium">Attendance & Marks API</span>
                            <Badge variant="success" size="sm">Optimal</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                            <span className="text-zinc-300 font-medium">Handshake Gateway</span>
                            <Badge variant="info" size="sm">Active</Badge>
                        </div>
                    </div>
                </div>

                <Link to="/side-by-side" className="mt-6">
                    <Button variant="outline" size="sm" className="w-full justify-center" icon={ArrowRight}>
                        Open Replica Suite
                    </Button>
                </Link>
            </Card>
        </div>
    </div>
);

const TrainerDashboard = ({ user }) => (
    <div className="space-y-8 pb-12">
        {/* Top Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
                <div className="flex items-center space-x-2.5 mb-1">
                    <Badge variant="secondary" size="sm" icon={School}>
                        Faculty Portal
                    </Badge>
                    <span className="text-xs text-zinc-500 font-mono">Semester Active</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                    Faculty Workspace · {user?.name}
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Manage assigned subjects, mark class attendance rosters, publish student exam marks, and mentor learners.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/academic-manager">
                    <Button variant="primary" icon={ClipboardPenLine}>
                        Class Manager
                    </Button>
                </Link>
                <Link to="/library">
                    <Button variant="secondary" icon={PlusCircle}>
                        Upload Material
                    </Button>
                </Link>
            </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard 
                icon={ClipboardPenLine} 
                title="Academic Manager" 
                description="Mark daily subject attendance and publish student internal/mid-sem marks." 
                label="Open Class Manager" 
                color="pink" 
                link="/academic-manager" 
            />
            <ActionCard 
                icon={Clock} 
                title="Active Queries" 
                description="Answer unresolved academic queries and doubt tickets submitted by your students." 
                label="Respond to Queries" 
                color="amber" 
                link="/queries" 
            />
            <ActionCard 
                icon={Users} 
                title="Mentor Handshakes" 
                description="Review mentorship requests from learners seeking guidance." 
                label="View Requests" 
                color="indigo" 
                link="/requests" 
            />
            <ActionCard 
                icon={BookOpen} 
                title="Study Materials" 
                description="Upload lecture presentations, code repositories, and notes for your subjects." 
                label="Manage Library" 
                color="emerald" 
                link="/library" 
            />
        </div>

        <SuggestionBox />
    </div>
);

const LearnerDashboard = ({ user }) => (
    <div className="space-y-8 pb-12">
        {/* Top Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
                <div className="flex items-center space-x-2.5 mb-1">
                    <Badge variant="primary" size="sm" icon={GraduationCap}>
                        Student Portal
                    </Badge>
                    <span className="text-xs text-zinc-500 font-mono">Enrolled Student</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                    Hello, {user?.name}
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                    Track your attendance health scores, review published assessment marks, and connect with mentors.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/academic-statistics">
                    <Button variant="success" icon={BarChart3}>
                        My Statistics
                    </Button>
                </Link>
                <Link to="/find-trainers">
                    <Button variant="primary" icon={Users}>
                        Find Mentors
                    </Button>
                </Link>
            </div>
        </div>

        {/* 3 Main Student Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 flex flex-col justify-between hover:border-emerald-500/40 group">
                <div>
                    <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 w-fit mb-6 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-100 mb-2">Academic Progress</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        Real-time attendance percentage per subject, internal exam marks, and your dynamic composite student health score.
                    </p>
                </div>
                <Link to="/academic-statistics">
                    <Button variant="success" size="md" className="w-full justify-center" icon={ArrowRight}>
                        View My Statistics
                    </Button>
                </Link>
            </Card>

            <Card className="p-8 flex flex-col justify-between hover:border-indigo-500/40 group">
                <div>
                    <div className="p-3 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 w-fit mb-6 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-100 mb-2">Find Your Mentor</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        Discover certified faculty & industry experts in your domain of interest and send a mentorship handshake request.
                    </p>
                </div>
                <Link to="/find-trainers">
                    <Button variant="primary" size="md" className="w-full justify-center" icon={ArrowRight}>
                        Explore Mentors
                    </Button>
                </Link>
            </Card>

            <Card className="p-8 flex flex-col justify-between hover:border-pink-500/40 group">
                <div>
                    <div className="p-3 rounded-2xl bg-pink-500/15 text-pink-400 border border-pink-500/30 w-fit mb-6 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-100 mb-2">Study Library</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        Access high-quality lecture slides, syllabus reference material, and lab assignments uploaded by faculty.
                    </p>
                </div>
                <Link to="/library">
                    <Button variant="secondary" size="md" className="w-full justify-center" icon={ArrowRight}>
                        Browse Materials
                    </Button>
                </Link>
            </Card>
        </div>

        <SuggestionBox />
    </div>
);

const ActionCard = ({ icon: Icon, title, description, label, color = 'indigo', link }) => {
    const colorClasses = {
        indigo: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30 group-hover:border-indigo-500/60',
        pink: 'text-pink-400 bg-pink-500/15 border-pink-500/30 group-hover:border-pink-500/60',
        emerald: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30 group-hover:border-emerald-500/60',
        amber: 'text-amber-400 bg-amber-500/15 border-amber-500/30 group-hover:border-amber-500/60'
    };

    const scheme = colorClasses[color] || colorClasses.indigo;

    return (
        <Link to={link || '#'} className="block group">
            <Card className="p-6 h-full flex flex-col justify-between transition-all duration-300">
                <div>
                    <div className={`p-3 rounded-2xl border w-fit mb-4 group-hover:scale-110 transition-transform duration-300 ${scheme}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-indigo-300 transition-colors">
                        {title}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                        {description}
                    </p>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 text-indigo-400 group-hover:underline">
                    <span>{label}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
            </Card>
        </Link>
    );
};

export default Dashboard;
