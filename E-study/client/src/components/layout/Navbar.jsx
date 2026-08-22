import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    BookOpen, LogOut, User, LayoutDashboard, ShieldCheck, 
    BarChart3, ClipboardPenLine, Settings, Users, Layers, 
    Menu, X, Sparkles, Bell
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

const Navbar = () => {
    const { userInfo, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
            isActive(path)
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
        }`;

    return (
        <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-1">
            <nav className="max-w-7xl mx-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/75 backdrop-blur-2xl shadow-2xl shadow-black/40 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Brand */}
                    <div className="flex items-center space-x-3">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-600 text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="font-extrabold text-lg text-white tracking-tight leading-none block">CampusSphere</span>
                                <span className="block text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-semibold mt-0.5">Academic ERP</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-2">
                        <Link to="/" className={navLinkClass('/')}>
                            <span>Home</span>
                        </Link>

                        {userInfo ? (
                            <>
                                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </Link>

                                {['learner', 'student'].includes(userInfo.role) && (
                                    <Link to="/academic-statistics" className={navLinkClass('/academic-statistics')}>
                                        <BarChart3 className="w-4 h-4 text-emerald-400" />
                                        <span>Statistics</span>
                                    </Link>
                                )}

                                {['trainer', 'faculty'].includes(userInfo.role) && (
                                    <Link to="/academic-manager" className={navLinkClass('/academic-manager')}>
                                        <ClipboardPenLine className="w-4 h-4 text-pink-400" />
                                        <span>Academics</span>
                                    </Link>
                                )}

                                {['admin', 'super_admin'].includes(userInfo.role) && (
                                    <>
                                        <Link to="/admin" className={navLinkClass('/admin')}>
                                            <Users className="w-4 h-4 text-blue-400" />
                                            <span>Users</span>
                                        </Link>
                                        <Link to="/academic-setup" className={navLinkClass('/academic-setup')}>
                                            <Settings className="w-4 h-4 text-pink-400" />
                                            <span>Setup</span>
                                        </Link>
                                    </>
                                )}

                                {userInfo.role === 'super_admin' && (
                                    <Link to="/admin-management" className={navLinkClass('/admin-management')}>
                                        <ShieldCheck className="w-4 h-4 text-amber-300" />
                                        <span>Super Admin</span>
                                    </Link>
                                )}

                                <div className="h-5 w-[1px] bg-zinc-800 mx-1" />

                                <Link to="/profile" className={navLinkClass('/profile')} title="My Profile">
                                    <Avatar name={userInfo.name} size="sm" status="online" />
                                    <span className="max-w-[100px] truncate">{userInfo.name?.split(' ')[0]}</span>
                                    <Badge size="sm" variant={userInfo.role === 'admin' || userInfo.role === 'super_admin' ? 'warning' : userInfo.role === 'faculty' || userInfo.role === 'trainer' ? 'secondary' : 'primary'}>
                                        {userInfo.role}
                                    </Badge>
                                </Link>

                                <button 
                                    onClick={logout}
                                    className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition duration-200"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={navLinkClass('/login')}>
                                    <span>Sign In</span>
                                </Link>
                                <Link to="/admin-register" className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 transition flex items-center space-x-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Admin Code</span>
                                </Link>
                                <Link to="/register" className="ml-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/30 active:scale-95">
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center space-x-2">
                        {userInfo && (
                            <Link to="/profile">
                                <Avatar name={userInfo.name} size="sm" status="online" />
                            </Link>
                        )}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-zinc-800 bg-zinc-950/95 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/')}>
                        <span>Home</span>
                    </Link>
                    {userInfo ? (
                        <>
                            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/dashboard')}>
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/profile')}>
                                <User className="w-4 h-4" />
                                <span>Profile Settings</span>
                            </Link>
                            {['learner', 'student'].includes(userInfo.role) && (
                                <Link to="/academic-statistics" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/academic-statistics')}>
                                    <BarChart3 className="w-4 h-4" />
                                    <span>Academic Statistics</span>
                                </Link>
                            )}
                            {['trainer', 'faculty'].includes(userInfo.role) && (
                                <Link to="/academic-manager" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/academic-manager')}>
                                    <ClipboardPenLine className="w-4 h-4" />
                                    <span>Faculty Manager</span>
                                </Link>
                            )}
                            {['admin', 'super_admin'].includes(userInfo.role) && (
                                <>
                                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/admin')}>
                                        <Users className="w-4 h-4" />
                                        <span>Manage Users</span>
                                    </Link>
                                    <Link to="/academic-setup" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/academic-setup')}>
                                        <Settings className="w-4 h-4" />
                                        <span>Academic Setup</span>
                                    </Link>
                                </>
                            )}
                            {userInfo.role === 'super_admin' && (
                                <Link to="/admin-management" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/admin-management')}>
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Admin Management</span>
                                </Link>
                            )}
                            <button
                                onClick={() => { logout(); setMobileMenuOpen(false); }}
                                className="w-full mt-4 flex items-center justify-center space-x-2 bg-red-600/20 text-red-400 border border-red-500/30 p-2.5 rounded-xl font-bold text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <div className="pt-2 space-y-2">
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-semibold">
                                Sign In
                            </Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-lg">
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    </header>
);
};

export default Navbar;
