import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FileText, Download, Plus, Trash2, Loader2, Upload, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MaterialLibrary = () => {
    const { userInfo } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newMaterial, setNewMaterial] = useState({ title: '', description: '', category: '', file: null });

    useEffect(() => {
        fetchMaterials();
    }, [userInfo]);

    const fetchMaterials = async () => {
        try {
            const endpoint = userInfo.role === 'trainer' ? '/materials/my-materials' : '/materials';
            const { data } = await api.get(endpoint);
            setMaterials(data);
        } catch (error) {
            toast.error('Failed to load materials');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newMaterial.file) return toast.error('Please select a file');
        
        setUploading(true);
        const formData = new FormData();
        formData.append('title', newMaterial.title);
        formData.append('description', newMaterial.description);
        formData.append('category', newMaterial.category);
        formData.append('material', newMaterial.file);

        try {
            await api.post('/materials/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Material Uploaded!');
            setShowUpload(false);
            fetchMaterials();
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        try {
            await api.delete(`/materials/${id}`);
            setMaterials(materials.filter(m => m._id !== id));
            toast.success('Deleted');
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-extrabold mb-2">Study Library</h2>
                    <p className="text-slate-400">Access quality study materials and tutorials.</p>
                </div>
                {userInfo.role === 'trainer' && (
                    <button 
                        onClick={() => setShowUpload(!showUpload)}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition shadow-lg shadow-primary/20"
                    >
                        {showUpload ? <FileText /> : <Plus />}
                        <span>{showUpload ? 'View My Library' : 'Upload New'}</span>
                    </button>
                )}
            </header>

            <AnimatePresence>
                {showUpload && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden mb-10"
                    >
                        <form onSubmit={handleUpload} className="p-8 space-y-6">
                            <h3 className="text-xl font-bold">Upload Study Material</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm text-slate-400 block mb-1">Title</label>
                                    <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3" value={newMaterial.title} onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 block mb-1">Category (e.g. React)</label>
                                    <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3" value={newMaterial.category} onChange={e => setNewMaterial({...newMaterial, category: e.target.value})} />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm text-slate-400 block mb-1">Description</label>
                                    <textarea className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3" value={newMaterial.description} onChange={e => setNewMaterial({...newMaterial, description: e.target.value})} />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm text-slate-400 block mb-2">File (PDF, DOC, ZIP, etc.)</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-2xl cursor-pointer bg-slate-900 hover:border-slate-500 transition">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-slate-500 mb-2" />
                                                <p className="text-sm text-slate-500">{newMaterial.file ? newMaterial.file.name : 'Click to upload your material'}</p>
                                            </div>
                                            <input type="file" className="hidden" onChange={e => setNewMaterial({...newMaterial, file: e.target.files[0]})} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button disabled={uploading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition">
                                {uploading ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Upload'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map(m => (
                    <motion.div layout key={m._id} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl group flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-emerald-500/10 p-3 rounded-xl">
                                    <FileText className="text-emerald-400" />
                                </div>
                                <span className="bg-slate-900 text-[10px] uppercase font-bold text-slate-500 px-2 py-1 rounded border border-slate-700">
                                    {m.category}
                                </span>
                            </div>
                            <h4 className="text-xl font-bold mb-2 group-hover:text-primary-light transition">{m.title}</h4>
                            <p className="text-slate-400 text-sm mb-6 line-clamp-3">{m.description || 'No description provided.'}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <a 
                                href={`http://localhost:5000${m.fileUrl}`} 
                                target="_blank" 
                                className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 py-2 rounded-xl text-center font-semibold hover:bg-slate-700 transition flex items-center justify-center space-x-2"
                            >
                                <Download size={16} />
                                <span>Download</span>
                            </a>
                            {userInfo.role === 'trainer' && (
                                <button 
                                    onClick={() => handleDelete(m._id)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {materials.length === 0 && !showUpload && (
                <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
                    <p className="text-slate-500">No materials found in the library.</p>
                </div>
            )}
        </div>
    );
};

export default MaterialLibrary;
