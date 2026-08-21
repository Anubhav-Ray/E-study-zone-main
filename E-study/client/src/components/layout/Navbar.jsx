import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, LogOut, User, LayoutDashboard, ShieldCheck, BarChart3, ClipboardPenLine, Settings, Users } from 'lucide-react';

const Navbar = () => {
    const { userInfo, logout } = useAuth();

    return (
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 text-primary-light font-bold text-xl">
                            <BookOpen className="w-8 h-8" />
                            <span>CampusSphere</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-slate-300 hover:text-white transition">Home</Link>
                        {userInfo ? (
                            <>
                                <Link to="/dashboard" className="text-slate-300 hover:text-white transition flex items-center space-x-1">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>{['admin', 'super_admin'].includes(userInfo.role) ? 'Admin Dashboard' : 'Dashboard'}</span>
                                </Link>
                                <Link to="/profile" className="text-slate-300 hover:text-white transition flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>Profile</span>
                                </Link>
                                {['learner', 'student'].includes(userInfo.role) && (
                                    <Link to="/academic-statistics" className="text-slate-300 hover:text-white transition flex items-center space-x-1">
                                        <BarChart3 className="w-4 h-4" />
                                        <span>Statistics</span>
                                    </Link>
                                )}
                                {['trainer', 'faculty'].includes(userInfo.role) && (
                                    <Link to="/academic-manager" className="text-slate-300 hover:text-white transition flex items-center space-x-1">
                                        <ClipboardPenLine className="w-4 h-4" />
                                        <span>Academics</span>
                                    </Link>
                                )}
                                {['admin', 'super_admin'].includes(userInfo.role) && (
                                    <>
                                        <Link to="/admin" className="text-slate-300 hover:text-white transition flex items-center space-x-1">
                                            <Users className="w-4 h-4" />
                                            <span>Users</span>
                                        </Link>
                                        <Link to="/academic-setup" className="text-slate-300 hover:text-white transition flex items-center space-x-1">
                                            <Settings className="w-4 h-4" />
                                            <span>Setup</span>
                                        </Link>
                                    </>
                                )}
                                {userInfo.role === 'super_admin' && (
                                    <Link to="/admin-management" className="text-slate-300 hover:text-white transition flex items-center space-x-1">
                                        <ShieldCheck className="w-4 h-4 text-amber-300" />
                                        <span>Admin Access</span>
                                    </Link>
                                )}
                                <button 
                                    onClick={logout}
                                    className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600/30 transition flex items-center space-x-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-300 hover:text-white transition">Login</Link>
                                <Link to="/admin-register" className="flex items-center space-x-1 text-amber-200 hover:text-amber-100 transition" title="Register administrator">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Admin Register</span>
                                </Link>
                                <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition shadow-lg shadow-primary/25">
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
