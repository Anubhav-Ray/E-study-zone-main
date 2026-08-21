import React, { useEffect, useState } from 'react';
import { AlertTriangle, BarChart3, BookOpenCheck, HeartPulse, Loader2, TrendingUp, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

const scoreStyle = {
    excellent: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    good: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    needs_attention: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    at_risk: 'bg-red-500/15 text-red-300 border-red-500/30'
};

const ProgressBar = ({ value, tone = 'bg-primary' }) => (
    <div className="h-2 overflow-hidden rounded-full bg-slate-700">
        <div className={`${tone} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
);

const StudentAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const { data } = await api.get('/performance/student/me');
                setStats(data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Unable to load academic statistics');
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;
    if (!stats) return <div className="rounded-2xl border border-slate-700 bg-slate-800 p-10 text-center text-slate-400">Your academic data is not available yet.</div>;

    const healthStatus = stats.healthScore.status.replaceAll('_', ' ');
    const performanceTone = stats.marks.overallPercentage >= 75 ? 'bg-emerald-500' : stats.marks.overallPercentage >= 40 ? 'bg-amber-500' : 'bg-red-500';

    return (
        <div className="space-y-8 pb-10">
            <header>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary-light">Student Success Centre</p>
                <h2 className="text-4xl font-extrabold">Academic Statistics</h2>
                <p className="mt-2 text-slate-400">Track your attendance, assessment performance, and areas that need attention.</p>
            </header>

            <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Metric icon={<UserCheck />} label="Overall Attendance" value={`${stats.attendance.overallPercentage}%`} tone="text-blue-300" />
                <Metric icon={<BarChart3 />} label="Assessment Average" value={`${stats.marks.overallPercentage}%`} tone="text-secondary-light" />
                <Metric icon={<HeartPulse />} label="Student Health Score" value={`${stats.healthScore.value}/100`} tone="text-emerald-300" />
            </section>

            <section className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold">Subject Attendance</h3>
                            <p className="text-sm text-slate-400">Maintain at least 75% in every subject.</p>
                        </div>
                        <UserCheck className="text-blue-300" />
                    </div>
                    <div className="space-y-5">
                        {stats.attendance.subjects.length ? stats.attendance.subjects.map((item) => (
                            <div key={item.subject._id}>
                                <div className="mb-2 flex justify-between gap-4 text-sm">
                                    <span className="font-semibold">{item.subject.name} <span className="text-slate-500">({item.subject.code})</span></span>
                                    <span className={item.isLowAttendance ? 'font-bold text-red-300' : 'font-bold text-emerald-300'}>{item.percentage}%</span>
                                </div>
                                <ProgressBar value={item.percentage} tone={item.isLowAttendance ? 'bg-red-500' : 'bg-blue-500'} />
                                <p className="mt-1 text-xs text-slate-500">{item.attendedClasses} of {item.totalClasses} classes attended</p>
                            </div>
                        )) : <EmptyData label="Attendance will appear once faculty marks your first class." />}
                    </div>
                </div>

                <aside className="rounded-2xl border border-slate-700 bg-slate-800 p-6 lg:col-span-2">
                    <HeartPulse className="mb-4 text-emerald-300" />
                    <h3 className="text-xl font-bold">Your Health Score</h3>
                    <div className="my-5 flex items-end gap-3">
                        <span className="text-5xl font-extrabold">{stats.healthScore.value}</span>
                        <span className="mb-1 text-slate-400">/ 100</span>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${scoreStyle[stats.healthScore.status]}`}>
                        {healthStatus}
                    </span>
                    <p className="mt-5 text-sm leading-6 text-slate-400">Calculated from your attendance (45%) and assessment performance (55%).</p>
                </aside>
            </section>

            <section className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 lg:col-span-3">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold">Subject Performance</h3>
                            <p className="text-sm text-slate-400">Combined assessment score per subject.</p>
                        </div>
                        <TrendingUp className="text-secondary-light" />
                    </div>
                    <div className="space-y-5">
                        {stats.marks.subjects.length ? stats.marks.subjects.map((item) => (
                            <div key={item.subject._id}>
                                <div className="mb-2 flex justify-between gap-4 text-sm">
                                    <span className="font-semibold">{item.subject.name}</span>
                                    <span className="font-bold">{item.percentage}%</span>
                                </div>
                                <ProgressBar value={item.percentage} tone={item.percentage < 40 ? 'bg-red-500' : performanceTone} />
                                <p className="mt-1 text-xs text-slate-500">{item.obtained} / {item.maximum} marks</p>
                            </div>
                        )) : <EmptyData label="Your assessment marks will appear after faculty publishes them." />}
                    </div>
                </div>

                <aside className="rounded-2xl border border-slate-700 bg-slate-800 p-6 lg:col-span-2">
                    <div className="mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-amber-300" />
                        <h3 className="text-xl font-bold">Action Centre</h3>
                    </div>
                    {stats.alerts.length ? <ul className="space-y-3">{stats.alerts.map((alert) => <li key={alert} className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-100">{alert}</li>)}</ul> : (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">Great work—there are no academic alerts at the moment.</div>
                    )}
                </aside>
            </section>
        </div>
    );
};

const Metric = ({ icon, label, value, tone }) => (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
        <div className={`${tone} mb-4`}>{React.cloneElement(icon, { size: 28 })}</div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
);

const EmptyData = ({ label }) => <p className="rounded-xl border border-dashed border-slate-600 p-5 text-center text-sm text-slate-500">{label}</p>;

export default StudentAnalytics;
