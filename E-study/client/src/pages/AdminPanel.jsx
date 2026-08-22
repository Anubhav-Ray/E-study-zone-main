import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { 
    Users, FileText, Trash2, Shield, Loader2, 
    Search, Filter, ShieldCheck, User, Sparkles 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (_error) {
            toast.error('Failed to load user directory');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id, name) => {
        if (!window.confirm(`Permanently remove ${name} from the platform?`)) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            toast.success(`User ${name} removed`);
        } catch (_error) {
            toast.error('Failed to delete user');
        }
    };

    const roleBadge = (role) => {
        switch (role) {
            case 'super_admin':
                return <Badge variant="warning" size="sm">Super Admin</Badge>;
            case 'admin':
                return <Badge variant="destructive" size="sm">Admin</Badge>;
            case 'faculty':
            case 'trainer':
                return <Badge variant="secondary" size="sm">Faculty</Badge>;
            case 'student':
            case 'learner':
            default:
                return <Badge variant="primary" size="sm">Student</Badge>;
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesRole = selectedRole === 'all' || u.role === selectedRole || 
                            (selectedRole === 'student' && u.role === 'learner') ||
                            (selectedRole === 'faculty' && u.role === 'trainer');
        const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              u.uniqueId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              u.role?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-zinc-400 text-sm font-medium">Fetching registered users database...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <header className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="destructive" size="sm" icon={Shield}>
                            Administration
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">{users.length} Total Users</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                        User Roster & Accounts
                    </h1>
                    <p className="mt-1 text-zinc-400 text-sm">
                        View, search, audit, and manage credentials for all registered students, faculty, and administrators.
                    </p>
                </div>
            </header>

            {/* Filter and Search Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Role Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[
                        { id: 'all', label: 'All Users' },
                        { id: 'student', label: 'Students' },
                        { id: 'faculty', label: 'Faculty' },
                        { id: 'admin', label: 'Admins' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedRole(tab.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                                selectedRole === tab.id
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input 
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500 transition"
                        placeholder="Search name, email, roll no..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Data Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-zinc-950 text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">System Role</th>
                                <th className="p-4">Unique ID / Code</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80 bg-zinc-900/20">
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="hover:bg-zinc-800/30 transition group">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <Avatar name={user.name} size="sm" />
                                            <div>
                                                <div className="font-bold text-zinc-100">{user.name}</div>
                                                <div className="text-xs text-zinc-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {roleBadge(user.role)}
                                    </td>
                                    <td className="p-4 font-mono text-xs text-zinc-400">
                                        {user.uniqueId || '—'}
                                    </td>
                                    <td className="p-4 text-right">
                                        {!['admin', 'super_admin'].includes(user.role) ? (
                                            <button 
                                                onClick={() => deleteUser(user._id, user.name)}
                                                className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        ) : (
                                            <span className="text-xs text-zinc-600 font-mono">Protected</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-16 text-center text-zinc-500 text-sm">
                        No accounts matching your filter criteria.
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminPanel;
