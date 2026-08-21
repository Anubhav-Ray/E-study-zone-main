import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Users, FileText, Trash2, Shield, Loader2, Search } from 'lucide-react';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            toast.success('User deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold flex items-center space-x-3">
                        <Shield className="text-primary-light" />
                        <span>User Management</span>
                    </h2>
                    <p className="text-slate-400 mt-1">Manage all registered learners, trainers, and admins.</p>
                </div>
                <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 p-2 text-sm outline-none focus:border-primary transition"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden overflow-x-auto shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/50 border-b border-slate-700">
                        <tr>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Name / Email</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">ID</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="hover:bg-slate-700/20 transition group">
                                <td className="p-4">
                                    <div className="font-bold">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                                        ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 
                                          user.role === 'trainer' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-xs text-slate-400">{user.uniqueId}</td>
                                <td className="p-4 text-right">
                                    {!['admin', 'super_admin'].includes(user.role) && (
                                        <button 
                                            onClick={() => deleteUser(user._id)}
                                            className="p-2 text-slate-500 hover:text-red-400 transition"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && <div className="p-10 text-center text-slate-500">No users found.</div>}
            </div>
        </div>
    );
};

export default AdminPanel;
