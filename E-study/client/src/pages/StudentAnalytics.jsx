import React, { useEffect, useState } from 'react';
import { 
    AlertTriangle, BarChart3, BookOpenCheck, HeartPulse, 
    Loader2, TrendingUp, UserCheck, CheckCircle2, ShieldAlert,
    Clock, Sparkles, ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const scoreBadges = {
    excellent: { variant: 'success', text: 'EXCELLENT HEALTH' },
    good: { variant: 'primary', text: 'GOOD HEALTH' },
    needs_attention: { variant: 'warning', text: 'NEEDS ATTENTION' },
    at_risk: { variant: 'destructive', text: 'AT ACADEMIC RISK' }
};

const ProgressBar = ({ value, tone = 'bg-indigo-500', isLow = false }) => (
    <div className="h-2.5 overflow-hidden rounded-full bg-zinc-950 border border-zinc-800/80">
        <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${
                isLow ? 'bg-red-500' : tone
            }`} 
            style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} 
        />
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-zinc-400 text-sm font-medium">Computing your academic telemetry...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <Card className="p-12 text-center max-w-xl mx-auto my-12">
                <div className="p-4 rounded-full bg-zinc-800/80 text-zinc-400 w-fit mx-auto mb-4">
                    <BookOpenCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100 mb-2">No Academic Records Yet</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    Your semester enrollment or faculty attendance has not been published yet. Once classes are marked, your telemetry will appear here.
                </p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Refresh Data
                </Button>
            </Card>
        );
    }

    const healthStatusKey = stats.healthScore?.status || 'good';
    const healthBadge = scoreBadges[healthStatusKey] || scoreBadges.good;
    const isGoodHealth = ['excellent', 'good'].includes(healthStatusKey);

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <header className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="primary" size="sm">
                            Student Success Engine
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">Real-time Telemetry</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                        Academic Analytics & Health
                    </h1>
                    <p className="mt-1 text-zinc-400 text-sm">
                        Continuous tracking of your lecture attendance, assessment scores, and dynamic health alerts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge 
                        variant={healthBadge.variant} 
                        size="lg"
                        className="px-4 py-2 text-xs font-bold"
                    >
                        <HeartPulse className="w-4 h-4 mr-1" />
                        {healthBadge.text}
                    </Badge>
                </div>
            </header>

            {/* Top 3 Core Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={UserCheck} 
                    title="Overall Attendance" 
                    value={`${stats.attendance.overallPercentage}%`} 
                    color={stats.attendance.overallPercentage >= 75 ? "emerald" : "pink"} 
                    subtitle={stats.attendance.overallPercentage >= 75 ? "Meets university 75% minimum" : "Warning: Below 75% threshold"} 
                    delta={stats.attendance.overallPercentage >= 75 ? "Compliant" : "Low"}
                    deltaType={stats.attendance.overallPercentage >= 75 ? "increase" : "decrease"}
                />
                <StatCard 
                    icon={BarChart3} 
                    title="Assessment Average" 
                    value={`${stats.marks.overallPercentage}%`} 
                    color="indigo" 
                    subtitle="Weighted internal & exam average"
                    delta="+4.2%"
                    deltaType="increase"
                />
                <StatCard 
                    icon={HeartPulse} 
                    title="Composite Health Score" 
                    value={`${stats.healthScore.value} / 100`} 
                    color={isGoodHealth ? "emerald" : "amber"} 
                    subtitle="45% Attendance + 55% Assessments"
                    delta={healthStatusKey.toUpperCase().replace('_', ' ')}
                    deltaType={isGoodHealth ? "increase" : "neutral"}
                />
            </section>

            {/* Subject Attendance Breakdown & Health Score Card */}
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Subject Attendance */}
                <Card className="lg:col-span-3 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                            <div>
                                <CardTitle className="text-xl">Subject Attendance Roster</CardTitle>
                                <CardDescription>University regulations require at least 75% attendance in all credit subjects.</CardDescription>
                            </div>
                            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                <UserCheck className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {stats.attendance.subjects.length ? (
                                stats.attendance.subjects.map((item) => (
                                    <div key={item.subject._id} className="space-y-2 p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="font-semibold text-zinc-200">
                                                <span>{item.subject.name}</span>
                                                <span className="text-xs font-mono text-zinc-500 ml-2">({item.subject.code})</span>
                                            </div>
                                            <Badge 
                                                variant={item.isLowAttendance ? "destructive" : "success"}
                                                size="sm"
                                            >
                                                {item.percentage}%
                                            </Badge>
                                        </div>
                                        <ProgressBar 
                                            value={item.percentage} 
                                            tone="bg-indigo-500" 
                                            isLow={item.isLowAttendance} 
                                        />
                                        <div className="flex justify-between text-xs text-zinc-500 font-medium pt-1">
                                            <span>Attended {item.attendedClasses} of {item.totalClasses} lectures</span>
                                            {item.isLowAttendance && (
                                                <span className="text-red-400 font-semibold flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> Minimum 75% not met
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm">
                                    No subject attendance records found for this semester.
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Health Score Gauge Panel */}
                <Card className="lg:col-span-2 p-6 flex flex-col justify-between border-indigo-500/30 bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-indigo-950/20">
                    <div>
                        <div className="flex items-center space-x-2.5 mb-4">
                            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <HeartPulse className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-xl">Health Formula</CardTitle>
                        </div>
                        <CardDescription>
                            Composite rating evaluating your lecture commitment and examination performance.
                        </CardDescription>

                        {/* Large Gauge Metric */}
                        <div className="my-8 text-center p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 relative overflow-hidden">
                            <div className="text-6xl font-black text-zinc-100 tracking-tight mb-2">
                                {stats.healthScore.value}
                                <span className="text-2xl font-normal text-zinc-500 ml-1">/ 100</span>
                            </div>
                            <Badge 
                                variant={healthBadge.variant} 
                                size="md"
                                className="px-3 py-1 font-extrabold"
                            >
                                {healthBadge.text}
                            </Badge>
                            <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
                                Calculated as: <strong>45%</strong> Attendance + <strong>55%</strong> Assessment Average.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
                        <div className="flex items-center justify-between">
                            <span>Attendance Weight (45%):</span>
                            <span className="font-bold text-zinc-200">{stats.attendance.overallPercentage * 0.45 | 0} pts</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Assessment Weight (55%):</span>
                            <span className="font-bold text-zinc-200">{stats.marks.overallPercentage * 0.55 | 0} pts</span>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Subject Performance & Action Centre */}
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Subject Performance */}
                <Card className="lg:col-span-3 p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                        <div>
                            <CardTitle className="text-xl">Subject Marks & Assessments</CardTitle>
                            <CardDescription>Aggregate assessment score per registered course module.</CardDescription>
                        </div>
                        <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {stats.marks.subjects.length ? (
                            stats.marks.subjects.map((item) => (
                                <div key={item.subject._id} className="space-y-2 p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold text-zinc-200">{item.subject.name}</span>
                                        <Badge 
                                            variant={item.percentage >= 75 ? "success" : item.percentage >= 40 ? "warning" : "destructive"}
                                            size="sm"
                                        >
                                            {item.percentage}%
                                        </Badge>
                                    </div>
                                    <ProgressBar 
                                        value={item.percentage} 
                                        tone={item.percentage >= 75 ? "bg-emerald-500" : "bg-amber-500"} 
                                        isLow={item.percentage < 40} 
                                    />
                                    <div className="flex justify-between text-xs text-zinc-500 font-medium pt-1">
                                        <span>Obtained {item.obtained} of {item.maximum} total marks</span>
                                        <span>Passing threshold: 40%</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm">
                                Assessment scores will appear once faculty publishes your first exam or quiz marks.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Action Centre */}
                <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-zinc-800">
                            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Action Centre</CardTitle>
                                <CardDescription>Smart recommendations based on attendance & marks.</CardDescription>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {stats.alerts.length ? (
                                stats.alerts.map((alert, idx) => (
                                    <div key={idx} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
                                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                        <span>{alert}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                    <span>Great performance! You currently have zero academic alerts or risks.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-zinc-800">
                        <Link to="/queries">
                            <Button variant="outline" size="sm" className="w-full justify-center" icon={ArrowRight}>
                                Ask Faculty a Doubt
                            </Button>
                        </Link>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default StudentAnalytics;
