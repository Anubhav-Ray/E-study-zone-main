import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { 
    User, Phone, MapPin, Calendar, Save, 
    Loader2, Award, Zap, Shield, Mail, Sparkles 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';

const Profile = () => {
    const { userInfo } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savingBasic, setSavingBasic] = useState(false);
    const [savingAdvance, setSavingAdvance] = useState(false);

    const isTrainer = ['trainer', 'faculty'].includes(userInfo?.role);
    const isLearner = ['learner', 'student'].includes(userInfo?.role);
    const hasAdvancedProfile = isTrainer || isLearner;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setProfile(data);
            } catch (_error) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleBasicUpdate = async (e) => {
        e.preventDefault();
        setSavingBasic(true);
        try {
            const basicData = {
                name: profile.name,
                ...profile.basicProfile
            };
            await api.put('/users/profile/basic', basicData);
            toast.success('Basic profile information updated');
        } catch (_error) {
            toast.error('Update failed');
        } finally {
            setSavingBasic(false);
        }
    };

    const handleAdvanceUpdate = async (e) => {
        e.preventDefault();
        if (!hasAdvancedProfile) return;
        setSavingAdvance(true);
        const endpoint = isTrainer ? '/users/profile/trainer' : '/users/profile/learner';
        const advanceData = isTrainer ? profile.trainerProfile : profile.learnerProfile;
        try {
            await api.put(endpoint, advanceData);
            toast.success('Expertise profile updated');
        } catch (_error) {
            toast.error('Update failed');
        } finally {
            setSavingAdvance(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-zinc-400 text-sm font-medium">Loading user settings & credentials...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
            {/* Header */}
            <header className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="primary" size="sm" icon={User}>
                            Account Preferences
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">UID: {userInfo?.uniqueId || 'Active'}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                        Profile & Settings
                    </h1>
                    <p className="mt-1 text-zinc-400 text-sm">
                        Manage your identity, contact details, academic specialization, and domain interests.
                    </p>
                </div>
            </header>

            {/* Profile Overview Card */}
            <Card className="p-6 border-indigo-500/30 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-indigo-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Avatar name={profile?.name} size="xl" status="online" />
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-xl font-bold text-zinc-100">{profile?.name}</h2>
                                <Badge variant="primary" size="sm">{userInfo?.role?.toUpperCase()}</Badge>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5">{profile?.email}</p>
                            <p className="text-xs text-zinc-500 font-mono mt-1">Unique Identifier: {profile?.uniqueId || userInfo?.uniqueId}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Basic Info Form */}
            <Card className="p-8">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-zinc-800">
                    <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Basic Personal Details</CardTitle>
                        <CardDescription>Primary account contact and identification details.</CardDescription>
                    </div>
                </div>

                <form onSubmit={handleBasicUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <Input 
                                label="Full Legal Name"
                                required
                                value={profile?.name || ''}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                        </div>

                        <Input 
                            label="Phone Number"
                            icon={Phone}
                            placeholder="+1 (555) 000-0000"
                            value={profile?.basicProfile?.phone || ''}
                            onChange={(e) => setProfile({
                                ...profile,
                                basicProfile: { ...profile?.basicProfile, phone: e.target.value }
                            })}
                        />

                        <Input 
                            label="City / Location"
                            icon={MapPin}
                            placeholder="San Francisco, CA"
                            value={profile?.basicProfile?.city || ''}
                            onChange={(e) => setProfile({
                                ...profile,
                                basicProfile: { ...profile?.basicProfile, city: e.target.value }
                            })}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button 
                            type="submit" 
                            variant="primary" 
                            loading={savingBasic}
                            icon={Save}
                        >
                            Save Personal Details
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Advanced Profile for Trainer / Student */}
            {hasAdvancedProfile && (
                <Card className="p-8">
                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-zinc-800">
                        <div className="p-2 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
                            {isTrainer ? <Award className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                        </div>
                        <div>
                            <CardTitle className="text-lg">
                                {isTrainer ? 'Faculty & Mentor Expertise' : 'Student Learning Interest Areas'}
                            </CardTitle>
                            <CardDescription>
                                {isTrainer 
                                    ? 'Tags and biography displayed to students seeking technical mentorship.'
                                    : 'Topics used to match you with top faculty mentors and study materials.'}
                            </CardDescription>
                        </div>
                    </div>

                    <form onSubmit={handleAdvanceUpdate} className="space-y-6">
                        <Input
                            label={isTrainer ? 'Specialization & Skill Tags (Comma Separated)' : 'Interest Topics (Comma Separated)'}
                            placeholder="e.g. Algorithms, React, Distributed Systems, Python"
                            value={
                                isTrainer 
                                    ? (profile?.trainerProfile?.expertise?.join(', ') || '')
                                    : (profile?.learnerProfile?.interests?.join(', ') || '')
                            }
                            onChange={(e) => {
                                const val = e.target.value.split(',').map(s => s.trim());
                                if (isTrainer) {
                                    setProfile({
                                        ...profile,
                                        trainerProfile: { ...profile?.trainerProfile, expertise: val }
                                    });
                                } else {
                                    setProfile({
                                        ...profile,
                                        learnerProfile: { ...profile?.learnerProfile, interests: val }
                                    });
                                }
                            }}
                        />

                        {isTrainer && (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                    Academic Biography & Research Experience
                                </label>
                                <textarea
                                    className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-pink-500 transition h-32"
                                    placeholder="Summarize your academic focus, subjects taught, and industry experience..."
                                    value={profile?.trainerProfile?.bio || ''}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        trainerProfile: { ...profile?.trainerProfile, bio: e.target.value }
                                    })}
                                />
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button 
                                type="submit" 
                                variant="secondary" 
                                loading={savingAdvance}
                                icon={Save}
                            >
                                Update Expertise Profile
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default Profile;
