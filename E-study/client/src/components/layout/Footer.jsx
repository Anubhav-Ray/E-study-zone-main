import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, Heart, Sparkles, Layers } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl mt-20 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center space-x-2 text-indigo-400 font-bold text-lg">
              <div className="p-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-zinc-100 font-extrabold tracking-tight">CampusSphere</span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Unified Academic ERP & Mentor Matching Platform. Empowering students, faculty, and administrators with intelligent tools.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ERP v2.4.0 — Operational</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3">Academic Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/academic-statistics" className="hover:text-indigo-400 transition">Student Analytics</Link></li>
              <li><Link to="/academic-manager" className="hover:text-indigo-400 transition">Faculty Manager</Link></li>
              <li><Link to="/academic-setup" className="hover:text-indigo-400 transition">Academic Setup</Link></li>
              <li><Link to="/library" className="hover:text-indigo-400 transition">Study Library</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3">Mentorship & Doubts</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/find-trainers" className="hover:text-indigo-400 transition">Find Expert Trainers</Link></li>
              <li><Link to="/requests" className="hover:text-indigo-400 transition">Handshake Requests</Link></li>
              <li><Link to="/queries" className="hover:text-indigo-400 transition">Query Resolution Hub</Link></li>
              <li><Link to="/side-by-side" className="hover:text-indigo-400 transition">Side-by-Side Replica Suite</Link></li>
            </ul>
          </div>

          {/* Access & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 mb-3">Portal Access</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-indigo-400 transition">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition">Student / Faculty Registration</Link></li>
              <li><Link to="/admin-register" className="hover:text-indigo-400 transition">Admin Code Onboarding</Link></li>
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition">Portal Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} CampusSphere ERP. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for Academic Excellence
            </span>
            <Link to="/side-by-side" className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
              <Layers className="w-3 h-3" />
              <span>Design Replica System</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
