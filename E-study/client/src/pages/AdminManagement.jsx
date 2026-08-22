import React, { useEffect, useState } from 'react';
import { 
    Crown, History, Loader2, ShieldCheck, ShieldOff, 
    Trash2, UserCog, Shield, Clock, ArrowRight, User 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';

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
            const [adminResponse, logResponse] = await Promise.all([
                api.get('/admin-management'),
                api.get(`/admin-management/audit-log${auditQuery}`)
            ]);
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
        if (!window.confirm(`Permanently revoke ${admin.name}'s administrative account?`)) return;
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
                <p className="text-zinc-400 text-sm font-medium">Loading security governance console...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <header className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="warning" size="sm" icon={Crown}>
                            Super Admin Console
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">Governance & Audits</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                        Administrative Access & Security
                    </h1>
                    <p className="mt-1 text-zinc-400 text-sm">
                        Grant or revoke administrator privileges, activate clearance keys, and review audit trail logs.
                    </p>
                </div>
            </header>

            {/* Administrators Table */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <UserCog className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Authorized Administrator Accounts</CardTitle>
                            <CardDescription>Privileged institutional users with backend configuration rights.</CardDescription>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-zinc-950 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                            <tr>
                                <th className="p-4">Administrator</th>
                                <th className="p-4">Clearance Role</th>
                                <th className="p-4">Account Status</th>
                                <th className="p-4 text-right">Security Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80 bg-zinc-900/20">
                            {admins.map((admin) => {
                                const isCurrentUser = admin._id === userInfo._id;
                                const isWorking = workingId === admin._id;
                                return (
                                    <tr key={admin._id} className="hover:bg-zinc-800/30 transition">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <Avatar name={admin.name} size="sm" />
                                                <div>
                                                    <div className="font-bold text-zinc-100 flex items-center gap-2">
                                                        {admin.name}
                                                        {isCurrentUser && <span className="text-[10px] text-indigo-400 font-mono font-bold">(You)</span>}
                                                    </div>
                                                    <div className="text-xs text-zinc-500">{admin.email} · {admin.uniqueId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge 
                                                variant={admin.role === 'super_admin' ? 'warning' : 'primary'}
                                                size="sm"
                                                icon={admin.role === 'super_admin' ? Crown : Shield}
                                            >
                                                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Badge 
                                                variant={admin.isActive ? 'success' : 'destructive'}
                                                size="sm"
                                            >
                                                {admin.isActive ? 'Active Clearance' : 'Suspended'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {isCurrentUser ? (
                                                    <span className="text-xs text-zinc-500 font-mono">Current Session</span>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={isWorking}
                                                            onClick={() => update(
                                                                admin._id, 
                                                                'role', 
                                                                { role: admin.role === 'super_admin' ? 'admin' : 'super_admin' }, 
                                                                admin.role === 'super_admin' ? 'Admin demoted' : 'Admin promoted to Super Admin'
                                                            )}
                                                        >
                                                            {admin.role === 'super_admin' ? 'Demote to Admin' : 'Make Super Admin'}
                                                        </Button>

                                                        <Button
                                                            variant={admin.isActive ? 'destructive' : 'success'}
                                                            size="sm"
                                                            disabled={isWorking}
                                                            onClick={() => update(
                                                                admin._id, 
                                                                'status', 
                                                                { isActive: !admin.isActive }, 
                                                                admin.isActive ? 'Account deactivated' : 'Account restored'
                                                            )}
                                                            icon={admin.isActive ? ShieldOff : ShieldCheck}
                                                        >
                                                            {admin.isActive ? 'Deactivate' : 'Restore'}
                                                        </Button>

                                                        {admin.role === 'admin' && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                disabled={isWorking}
                                                                onClick={() => deleteAdmin(admin)}
                                                                icon={Trash2}
                                                            >
                                                                Revoke
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Audit Log Timeline */}
            <Card className="p-6">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
                            <History className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Security & Administration Audit Log</CardTitle>
                            <CardDescription>Immutable record of role changes, activations, and deletions.</CardDescription>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-zinc-400 font-semibold">Timeframe:</span>
                        <select 
                            value={auditDays} 
                            onChange={(e) => setAuditDays(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-indigo-500"
                        >
                            <option value={7}>Last 7 days</option>
                            <option value={30}>Last 30 days</option>
                            <option value={90}>Last 90 days</option>
                            <option value={0}>All Time History</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    {logs.length ? (
                        logs.map((log) => (
                            <div key={log._id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="primary" size="sm">{log.action?.replaceAll('_', ' ')}</Badge>
                                        <span className="font-bold text-zinc-200">
                                            {log.actorId?.name || 'Admin'} &rarr; {log.targetId?.name || 'Revoked user'}
                                        </span>
                                    </div>
                                    {log.details && <p className="text-zinc-400 mt-1">{log.details}</p>}
                                </div>
                                <div className="text-zinc-500 font-mono text-[11px] shrink-0 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {new Date(log.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-zinc-500 text-sm italic">
                            No administrative changes recorded in this period.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminManagement;
