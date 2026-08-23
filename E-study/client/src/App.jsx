import React, { useState, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import FindTrainers from './pages/FindTrainers';
import HandshakeRequests from './pages/HandshakeRequests';
import MaterialLibrary from './pages/MaterialLibrary';
import QuerySection from './pages/QuerySection';
import AdminPanel from './pages/AdminPanel';
import StudentAnalytics from './pages/StudentAnalytics';
import FacultyAcademicManager from './pages/FacultyAcademicManager';
import AcademicSetup from './pages/AcademicSetup';
import AdminRegister from './pages/AdminRegister';
import AdminManagement from './pages/AdminManagement';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { motion } from 'framer-motion';
import {
    BookOpen, Users, BarChart3, ShieldCheck, Sparkles,
    ArrowRight, CheckCircle2, GraduationCap, School,
    Layers, Zap, MessageSquare, Award, Clock, HeartPulse,
    TrendingUp, UserCheck, Shield, ChevronRight, Activity,
    Compass, Check, Cpu
} from 'lucide-react';
import { Card } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import InteractiveDotBackground from './components/common/InteractiveDotBackground';

// 3D Interactive Mouse-Tracking Tilt Card Component
const TiltCard = ({ children, className = '', maxTilt = 12, depth = 30 }) => {
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        setTilt({
            rotateX,
            rotateY,
            glareX: (x / rect.width) * 100,
            glareY: (y / rect.height) * 100,
            glareOpacity: 0.18
        });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.15s ease-out'
            }}
            className={`relative rounded-2xl will-change-transform ${className}`}
        >
            {/* Dynamic Glare Reflection */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-30"
                style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,${tilt.glareOpacity}), transparent 65%)`
                }}
            />
            <div style={{ transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }}>
                {children}
            </div>
        </div>
    );
};

// 3D Isometric Hero Showcase Stage
const Isometric3DHeroStage = () => {
    return (
        <div className="relative mt-12 max-w-5xl mx-auto w-full px-2 sm:px-4">
            {/* Status Pills Ribbon cleanly placed above the 3D stage */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-2">
                <div className="p-3 px-5 rounded-2xl bg-zinc-900/90 border border-emerald-500/40 shadow-xl shadow-emerald-500/10 backdrop-blur-xl flex items-center space-x-3">
                    <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-400">Semester Status</p>
                        <p className="text-xs sm:text-sm font-black text-zinc-100">75% Attendance Compliant</p>
                    </div>
                </div>

                <div className="p-3 px-5 rounded-2xl bg-zinc-900/90 border border-pink-500/40 shadow-xl shadow-pink-500/10 backdrop-blur-xl flex items-center space-x-3">
                    <div className="p-1.5 rounded-xl bg-pink-500/20 text-pink-400">
                        <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-400">Composite Health</p>
                        <p className="text-xs sm:text-sm font-black text-pink-300">92/100 · Excellent</p>
                    </div>
                </div>
            </div>

            {/* Main 3D Tilted Dashboard Stage */}
            <div className="isometric-hero-stage w-full">
                <div className="gradient-border shadow-2xl shadow-indigo-950/70 w-full">
                    <div className="gradient-border-inner p-6 sm:p-8 space-y-6 bg-zinc-950/95 border border-zinc-800">
                        {/* 3D App Header Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800 depth-layer-1">
                            <div className="flex items-center space-x-3">
                                <div className="flex space-x-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                </div>
                                <div className="h-4 w-[1px] bg-zinc-800 mx-1" />
                                <span className="font-extrabold text-sm sm:text-base text-zinc-100 tracking-wide flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    CampusSphere Real-Time Academic Cockpit
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                </span>
                                <Badge variant="success" size="sm">
                                    Telemetry Live
                                </Badge>
                                <span className="text-xs font-mono text-zinc-500 ml-1">v2.4.0</span>
                            </div>
                        </div>

                        {/* 3D Dashboard Body Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 depth-layer-2">
                            {/* Card 1: Attendance */}
                            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-indigo-500/30 space-y-4 hover:border-indigo-500/60 transition shadow-lg">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold uppercase tracking-wider text-zinc-400 text-xs">Class Attendance</span>
                                    <Badge size="sm" variant="success">88.5%</Badge>
                                </div>
                                <div className="text-3xl sm:text-4xl font-black text-zinc-100">
                                    38 <span className="text-xs text-zinc-500 font-normal">/ 43 Lectures</span>
                                </div>
                                <div className="h-2 rounded-full bg-zinc-950 overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 w-[88.5%]" />
                                </div>
                                <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Meets 75% minimum threshold
                                </p>
                            </div>

                            {/* Card 2: Internal Assessment */}
                            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-pink-500/30 space-y-4 hover:border-pink-500/60 transition shadow-lg">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold uppercase tracking-wider text-zinc-400 text-xs">Assessment Average</span>
                                    <Badge size="sm" variant="secondary">94.0%</Badge>
                                </div>
                                <div className="text-3xl sm:text-4xl font-black text-zinc-100">
                                    141 <span className="text-xs text-zinc-500 font-normal">/ 150 Marks</span>
                                </div>
                                <div className="h-2 rounded-full bg-zinc-950 overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-indigo-400 w-[94%]" />
                                </div>
                                <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-pink-400" /> Distinction Standing
                                </p>
                            </div>

                            {/* Card 3: Mentor Connection */}
                            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 space-y-4 hover:border-emerald-500/60 transition shadow-lg">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold uppercase tracking-wider text-zinc-400 text-xs">Assigned Faculty</span>
                                    <Badge size="sm" variant="primary">Online</Badge>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                                        DR
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-zinc-100 text-sm">Dr. Rohit Sharma</h5>
                                        <p className="text-xs text-zinc-400">Algorithms & Distributed DB</p>
                                    </div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300 flex justify-between items-center">
                                    <span>Active Doubt Tickets:</span>
                                    <span className="font-bold text-emerald-400">0 Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Motion Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
};

// High-end 3D Landing Page View
const Home = () => (
    <div className="relative space-y-28 py-6 min-h-screen">
        {/* Interactive Dynamic Particle Dot Matrix Background */}
        <InteractiveDotBackground />

        {/* 3D Hero Section */}
        <section className="relative pt-8 pb-4 text-center max-w-6xl mx-auto px-4 z-10">
            {/* Seamless Full-Bleed Atmospheric Glow */}
            <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[120vw] h-[550px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 max-w-4xl mx-auto"
            >
                {/* Floating 3D Badge */}
                <motion.div variants={itemVariants} className="inline-block">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-indigo-500/40 bg-zinc-900/90 text-indigo-300 text-xs sm:text-sm font-bold uppercase tracking-wider backdrop-blur-2xl shadow-xl shadow-indigo-500/10 animate-float">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>Next-Gen 3D Spatial Academic ERP & Mentorship</span>
                    </div>
                </motion.div>

                {/* Main Headline */}
                <motion.h1 
                    variants={itemVariants}
                    className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-zinc-100 max-w-4xl mx-auto"
                >
                    Unified College ERP <br />
                    <span className="gradient-text-primary">Mastered for Excellence</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                    variants={itemVariants}
                    className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mt-4"
                >
                    Connect students with faculty, track real-time attendance & assessment health scores, collaborate over lecture materials, and resolve academic doubts effortlessly.
                </motion.p>

                {/* Call to Actions */}
                <motion.div 
                    variants={itemVariants}
                    className="flex flex-wrap items-center justify-center gap-4 font-semibold text-sm pt-3"
                >
                    <Link to="/register">
                        <Button size="lg" variant="primary" icon={ArrowRight} className="shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-600/60 transition-all duration-300 px-8 py-3.5 text-base font-bold">
                            Get Started Now
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button size="lg" variant="outline" className="backdrop-blur-md px-8 py-3.5 text-base font-semibold">
                            Sign In to Portal
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>

            {/* 3D Isometric Interactive Stage */}
            <Isometric3DHeroStage />
        </section>

        {/* 3D Live Metrics Ribbon */}
        <section className="relative z-10 border-y border-zinc-800/80 bg-zinc-900/40 backdrop-blur-2xl py-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <TiltCard maxTilt={15} depth={20}>
                    <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 shadow-xl">
                        <p className="text-3xl sm:text-4xl font-black text-indigo-400">99.8%</p>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mt-1">Platform Uptime</p>
                    </div>
                </TiltCard>
                <TiltCard maxTilt={15} depth={20}>
                    <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 shadow-xl">
                        <p className="text-3xl sm:text-4xl font-black text-pink-400">10,000+</p>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mt-1">Enrolled Students</p>
                    </div>
                </TiltCard>
                <TiltCard maxTilt={15} depth={20}>
                    <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 shadow-xl">
                        <p className="text-3xl sm:text-4xl font-black text-emerald-400">450+</p>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mt-1">Verified Faculty</p>
                    </div>
                </TiltCard>
                <TiltCard maxTilt={15} depth={20}>
                    <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 shadow-xl">
                        <p className="text-3xl sm:text-4xl font-black text-amber-400">0 ms</p>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mt-1">Real-time Telemetry</p>
                    </div>
                </TiltCard>
            </div>
        </section>

        {/* 3D Interactive Feature Cards with Tilt */}
        <section className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                <Badge variant="primary" size="sm">Core Architecture</Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                    Everything You Need in One 3D Unified Platform
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    Designed specifically for modern engineering, medical, and arts colleges. Hover over cards to inspect 3D spatial depth.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 3D Tilt Card 1 */}
                <TiltCard maxTilt={14} depth={30} className="h-full">
                    <Card className="p-8 h-full flex flex-col justify-between group hover:border-indigo-500/50 transition-all duration-300 shadow-2xl bg-zinc-900/90 border-zinc-800">
                        <div>
                            <div className="p-4 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 w-fit mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/10">
                                <BarChart3 className="w-7 h-7" />
                            </div>
                            <Badge variant="primary" size="sm" className="mb-3">Telemetry Engine</Badge>
                            <h3 className="text-xl font-bold text-zinc-100 mb-2">Real-Time Academic Analytics</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Automated composite health scores combining 45% lecture attendance with 55% assessment marks, complete with proactive risk alerts.
                            </p>
                        </div>
                        <Link to="/register" className="text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 text-indigo-400 group-hover:underline">
                            <span>Explore Analytics</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Card>
                </TiltCard>

                {/* 3D Tilt Card 2 */}
                <TiltCard maxTilt={14} depth={30} className="h-full">
                    <Card className="p-8 h-full flex flex-col justify-between group hover:border-pink-500/50 transition-all duration-300 shadow-2xl bg-zinc-900/90 border-zinc-800">
                        <div>
                            <div className="p-4 rounded-2xl bg-pink-500/15 text-pink-400 border border-pink-500/30 w-fit mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/10">
                                <Users className="w-7 h-7" />
                            </div>
                            <Badge variant="secondary" size="sm" className="mb-3">Mentorship Network</Badge>
                            <h3 className="text-xl font-bold text-zinc-100 mb-2">Faculty Mentorship Handshake</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Match with expert faculty based on technical interests, send 1-on-1 handshake requests, and get direct coursework guidance.
                            </p>
                        </div>
                        <Link to="/register" className="text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 text-pink-400 group-hover:underline">
                            <span>Connect with Mentors</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Card>
                </TiltCard>

                {/* 3D Tilt Card 3 */}
                <TiltCard maxTilt={14} depth={30} className="h-full">
                    <Card className="p-8 h-full flex flex-col justify-between group hover:border-emerald-500/50 transition-all duration-300 shadow-2xl bg-zinc-900/90 border-zinc-800">
                        <div>
                            <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 w-fit mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <Badge variant="success" size="sm" className="mb-3">Knowledge Base</Badge>
                            <h3 className="text-xl font-bold text-zinc-100 mb-2">Study Material Library</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Centralized repository for verified lecture slides, syllabus documents, lab guides, and assignments downloadable anytime.
                            </p>
                        </div>
                        <Link to="/register" className="text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 text-emerald-400 group-hover:underline">
                            <span>Browse Library</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Card>
                </TiltCard>
            </div>
        </section>

        {/* 3D Role Portals Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4">
            <Card className="p-8 sm:p-12 border-indigo-500/30 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-indigo-950/30 shadow-2xl overflow-hidden relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                        <Badge variant="primary" size="md">Role-Based Access</Badge>
                        <h2 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight leading-tight">
                            One Unified Platform for the Entire College Ecosystem
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Tailored workflows for students tracking performance, faculty managing attendance & doubts, and administrators configuring department curricula.
                        </p>
                        <div className="space-y-3 text-xs text-zinc-300">
                            <div className="flex items-center space-x-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Institutional Department, Course & Semester Enrollment Wizard</span>
                            </div>
                            <div className="flex items-center space-x-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Class attendance roster with 1-click bulk status toggles</span>
                            </div>
                            <div className="flex items-center space-x-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Multi-admin governance hierarchy with complete immutable audit logs</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <TiltCard maxTilt={18} depth={25} className="h-full">
                            <Link to="/login" className="block h-full">
                                <Card className="p-6 bg-zinc-950/90 hover:border-indigo-500/60 transition h-full flex flex-col justify-between shadow-xl">
                                    <div>
                                        <GraduationCap className="w-8 h-8 text-indigo-400 mb-3" />
                                        <h4 className="font-bold text-zinc-100">Student Portal</h4>
                                        <p className="text-xs text-zinc-400 mt-1">Check grades, attendance & doubts.</p>
                                    </div>
                                    <span className="text-xs text-indigo-400 font-bold mt-4 inline-flex items-center gap-1">
                                        Sign In &rarr;
                                    </span>
                                </Card>
                            </Link>
                        </TiltCard>

                        <TiltCard maxTilt={18} depth={25} className="h-full">
                            <Link to="/login" className="block h-full">
                                <Card className="p-6 bg-zinc-950/90 hover:border-pink-500/60 transition h-full flex flex-col justify-between shadow-xl">
                                    <div>
                                        <School className="w-8 h-8 text-pink-400 mb-3" />
                                        <h4 className="font-bold text-zinc-100">Faculty Portal</h4>
                                        <p className="text-xs text-zinc-400 mt-1">Manage classes, marks & materials.</p>
                                    </div>
                                    <span className="text-xs text-pink-400 font-bold mt-4 inline-flex items-center gap-1">
                                        Sign In &rarr;
                                    </span>
                                </Card>
                            </Link>
                        </TiltCard>

                        <TiltCard maxTilt={18} depth={25} className="h-full">
                            <Link to="/login" className="block h-full">
                                <Card className="p-6 bg-zinc-950/90 hover:border-amber-500/60 transition h-full flex flex-col justify-between shadow-xl">
                                    <div>
                                        <ShieldCheck className="w-8 h-8 text-amber-400 mb-3" />
                                        <h4 className="font-bold text-zinc-100">Admin Portal</h4>
                                        <p className="text-xs text-zinc-400 mt-1">System setup, departments & users.</p>
                                    </div>
                                    <span className="text-xs text-amber-400 font-bold mt-4 inline-flex items-center gap-1">
                                        Sign In &rarr;
                                    </span>
                                </Card>
                            </Link>
                        </TiltCard>
                    </div>
                </div>
            </Card>
        </section>
    </div>
);

function App() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'glass-panel text-zinc-100 border border-zinc-800 shadow-2xl rounded-xl',
                    style: {
                        background: '#18181b',
                        color: '#fafafa',
                        border: '1px solid #27272a'
                    }
                }}
            />
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin-register" element={<AdminRegister />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/find-trainers" element={<ProtectedRoute><FindTrainers /></ProtectedRoute>} />
                    <Route path="/requests" element={<ProtectedRoute><HandshakeRequests /></ProtectedRoute>} />
                    <Route path="/library" element={<ProtectedRoute><MaterialLibrary /></ProtectedRoute>} />
                    <Route path="/queries" element={<ProtectedRoute><QuerySection /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
                    <Route path="/academic-statistics" element={<ProtectedRoute><StudentAnalytics /></ProtectedRoute>} />
                    <Route path="/academic-manager" element={<ProtectedRoute><FacultyAcademicManager /></ProtectedRoute>} />
                    <Route path="/academic-setup" element={<ProtectedRoute role="admin"><AcademicSetup /></ProtectedRoute>} />
                    <Route path="/admin-management" element={<ProtectedRoute role="super_admin"><AdminManagement /></ProtectedRoute>} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App;
