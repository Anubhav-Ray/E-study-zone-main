import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { User, Phone, MapPin, Calendar, Save, Loader2, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { userInfo } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const isTrainer = ['trainer', 'faculty'].includes(userInfo.role);
    const isLearner = ['learner', 'student'].includes(userInfo.role);
    const hasAdvancedProfile = isTrainer || isLearner;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setProfile(data);
            } catch (error) {
                toast.error('Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleBasicUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const basicData = {
                name: profile.name,
                ...profile.basicProfile
            };
            await api.put('/users/profile/basic', basicData);
            toast.success('Basic Profile Updated');
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleAdvanceUpdate = async (e) => {
        e.preventDefault();
        if (!hasAdvancedProfile) return;
        setSaving(true);
        const endpoint = isTrainer ? '/users/profile/trainer' : '/users/profile/learner';
        const advanceData = isTrainer ? profile.trainerProfile : profile.learnerProfile;
        try {
            await api.put(endpoint, advanceData);
            toast.success('Advance Profile Updated');
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <header>
                <h2 className="text-4xl font-extrabold mb-2">Profile Settings</h2>
                <p className="text-slate-400">Manage your personal information and expertise areas.</p>
            </header>

            {/* Basic Profile */}
            <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-8"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <User className="text-primary-light" />
                    <h3 className="text-xl font-bold">Basic Information</h3>
                </div>
                <form onSubmit={handleBasicUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="text-sm text-slate-400 block mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Phone Number</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
                            value={profile.basicProfile?.phone || ''}
                            onChange={(e) => setProfile({...profile, basicProfile: {...profile.basicProfile, phone: e.target.value}})}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">City</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
                            value={profile.basicProfile?.city || ''}
                            onChange={(e) => setProfile({...profile, basicProfile: {...profile.basicProfile, city: e.target.value}})}
                        />
                    </div>
                    <div className="col-span-2 flex justify-end">
                        <button disabled={saving} className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition">
                            <Save size={18} />
                            <span>Save Basic Info</span>
                        </button>
                    </div>
                </form>
            </motion.section>

            {/* Advanced profiles are relevant only to learner/student and trainer/faculty accounts. */}
            {hasAdvancedProfile && <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-8"
            >
                <div className="flex items-center space-x-3 mb-6">
                    {isTrainer ? <Award className="text-secondary" /> : <Zap className="text-amber-400" />}
                    <h3 className="text-xl font-bold">{isTrainer ? 'Trainer Expertise' : 'Learning Interests'}</h3>
                </div>
                <form onSubmit={handleAdvanceUpdate} className="space-y-6">
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">
                            {isTrainer ? 'Expertise Areas (Comma separated)' : 'Interest Areas (Comma separated)'}
                        </label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3"
                            placeholder="e.g. React, Node.js, Python"
                            value={isTrainer ? profile.trainerProfile?.expertise?.join(', ') : profile.learnerProfile?.interests?.join(', ')}
                            onChange={(e) => {
                                const val = e.target.value.split(',').map(s => s.trim());
                                if (isTrainer) {
                                    setProfile({...profile, trainerProfile: {...profile.trainerProfile, expertise: val}});
                                } else {
                                    setProfile({...profile, learnerProfile: {...profile.learnerProfile, interests: val}});
                                }
                            }}
                        />
                    </div>
                    {isTrainer && (
                        <div>
                            <label className="text-sm text-slate-400 block mb-1">Bio / Experience</label>
                            <textarea 
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 h-32"
                                value={profile.trainerProfile?.bio || ''}
                                onChange={(e) => setProfile({...profile, trainerProfile: {...profile.trainerProfile, bio: e.target.value}})}
                            />
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button disabled={saving} className="bg-secondary hover:bg-secondary-dark text-white px-6 py-2 rounded-xl flex items-center space-x-2 transition shadow-lg shadow-secondary/20">
                            <Save size={18} />
                            <span>Save Advance Profile</span>
                        </button>
                    </div>
                </form>
            </motion.section>}
        </div>
    );
};

export default Profile;
