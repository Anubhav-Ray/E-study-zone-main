import React, { useEffect, useState } from 'react';
import { Crown, History, Loader2, ShieldCheck, ShieldOff, Trash2, UserCog } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminManagement = () => {
    const { userInfo } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workingId, setWorkingId] = useState('');
    const [auditDays, setAuditDays] = useState(30);

    const load = async () => {
        try {
            const auditQuery = auditDays ? `?days=${auditDays}` : '';
            const [adminResponse, logResponse] = await Promise.all([api.get('/admin-management'), api.get(`/admin-management/audit-log${auditQuery}`)]);
            setAdmins(adminResponse.data);
            setLogs(logResponse.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to load admin management');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, [auditDays]);

    const update = async (id, endpoint, payload, message) => {
        setWorkingId(id);
        try {
            await api.patch(`/admin-management/${id}/${endpoint}`, payload);
            toast.success(message);
            await load();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update administrator');
        } finally {
            setWorkingId('');
        }
    };

    const deleteAdmin = async (admin) => {
        if (!window.confirm(`Delete ${admin.name}'s admin account permanently?`)) return;
        setWorkingId(admin._id);
        try {
            await api.delete(`/admin-management/${admin._id}`);
            toast.success('Admin account deleted');
            await load();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to delete administrator');
        } finally {
            setWorkingId('');
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;
    return (
        <div className="space-y-8 pb-10">
            <header>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-amber-300">Super Admin Workspace</p>
                <h2 className="text-4xl font-extrabold">Admin Management</h2>
                <p className="mt-2 text-slate-400">Transfer administration safely, control account access, and review every administrative change.</p>
            </header>
            <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                <div className="border-b border-slate-700 p-6"><h3 className="flex items-center gap-2 text-xl font-bold"><UserCog className="text-primary-light" />Administrator Accounts</h3></div>
                <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-900/70 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4">Administrator</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-700">
                    {admins.map((admin) => {
                        const isCurrentUser = admin._id === userInfo._id;
                        const isWorking = workingId === admin._id;
                        return <tr key={admin._id} className="hover:bg-slate-700/20"><td className="p-4"><p className="font-bold">{admin.name}{isCurrentUser && <span className="ml-2 text-xs font-normal text-slate-500">(you)</span>}</p><p className="text-xs text-slate-500">{admin.email} · {admin.uniqueId}</p></td><td className="p-4"><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${admin.role === 'super_admin' ? 'bg-amber-400/15 text-amber-200' : 'bg-primary/15 text-primary-light'}`}>{admin.role === 'super_admin' && <Crown size={13} />}{admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span></td><td className="p-4"><span className={admin.isActive ? 'text-emerald-300' : 'text-red-300'}>{admin.isActive ? 'Active' : 'Inactive'}</span></td><td className="p-4"><div className="flex justify-end gap-2">{isCurrentUser ? <span className="py-2 text-xs text-slate-500">Your account</span> : <><button disabled={isWorking} onClick={() => update(admin._id, 'role', { role: admin.role === 'super_admin' ? 'admin' : 'super_admin' }, admin.role === 'super_admin' ? 'Admin demoted' : 'Admin promoted to Super Admin')} className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold hover:border-primary disabled:opacity-50">{admin.role === 'super_admin' ? 'Make Admin' : 'Make Super Admin'}</button><button disabled={isWorking} onClick={() => update(admin._id, 'status', { isActive: !admin.isActive }, admin.isActive ? 'Admin account deactivated' : 'Admin account restored')} className={`rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-50 ${admin.isActive ? 'bg-red-500/15 text-red-300 hover:bg-red-500/25' : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'}`}>{admin.isActive ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}</button>{admin.role === 'admin' && <button disabled={isWorking} onClick={() => deleteAdmin(admin)} className="inline-flex items-center gap-1 rounded-lg bg-red-500/15 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/25 disabled:opacity-50" title="Delete admin account"><Trash2 size={15} />Delete</button>}</>}</div></td></tr>;
                    })}
                </tbody></table></div>
            </section>
            <section className="rounded-2xl border border-slate-700 bg-slate-800 p-6"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h3 className="flex items-center gap-2 text-xl font-bold"><History className="text-secondary-light" />Admin Audit Log</h3><select value={auditDays} onChange={(event) => setAuditDays(Number(event.target.value))} className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-primary"><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option><option value={0}>All time</option></select></div><div className="space-y-3">{logs.length ? logs.map((log) => <div key={log._id} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"><p className="font-semibold capitalize">{log.action.replaceAll('_', ' ')}</p><p className="mt-1 text-sm text-slate-400">{log.actorId?.name || 'Unknown'} → {log.targetId?.name || 'Deleted administrator'}</p>{log.details && <p className="mt-1 text-xs text-slate-500">{log.details}</p>}<p className="mt-1 text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</p></div>) : <p className="text-sm text-slate-500">No administration changes recorded in this period.</p>}</div></section>
        </div>
    );
};

export default AdminManagement;
