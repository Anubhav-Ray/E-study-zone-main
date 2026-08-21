import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
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

// Temporary Pages Placeholder
const Home = () => (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary-light to-secondary text-transparent bg-clip-text">
            Master Your Future <br /> with CampusSphere
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mb-10">
            Connect with expert trainers, access premium study materials, and accelerate your learning journey in the IT world.
        </p>
        <div className="flex space-x-4">
            <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold transition shadow-xl shadow-primary/30">
                Start Learning
            </Link>
            <Link to="/login" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold transition border border-slate-700">
                Explore Trainers
            </Link>
        </div>
    </div>
);

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
        <Toaster position="top-right" />
        <Navbar />
        <main className="max-w-7xl mx-auto pt-10 px-4">
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
    </div>
  )
}

export default App
