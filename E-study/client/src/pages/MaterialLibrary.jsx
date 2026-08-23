import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
    FileText, Download, Plus, Trash2, Loader2, 
    Upload, ExternalLink, Search, Sparkles, Filter, 
    BookOpen, Layers, X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const MaterialLibrary = () => {
    const { userInfo } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [newMaterial, setNewMaterial] = useState({ title: '', description: '', category: '', file: null });

    const isFaculty = ['trainer', 'faculty', 'admin', 'super_admin'].includes(userInfo?.role);

    const fetchMaterials = async () => {
        try {
            const endpoint = userInfo?.role === 'trainer' ? '/materials/my-materials' : '/materials';
            const { data } = await api.get(endpoint);
            setMaterials(data);
        } catch (_error) {
            toast.error('Failed to load study materials');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, [userInfo]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newMaterial.file) return toast.error('Please select a document or file');
        
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
            toast.success('Study material published to library!');
            setShowUpload(false);
            setNewMaterial({ title: '', description: '', category: '', file: null });
            fetchMaterials();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this study material from the library?')) return;
        try {
            await api.delete(`/materials/${id}`);
            setMaterials(materials.filter(m => m._id !== id));
            toast.success('Material deleted');
        } catch (_error) {
            toast.error('Delete failed');
        }
    };

    const categories = ['All', ...new Set(materials.map(m => m.category).filter(Boolean))];

    const filteredMaterials = materials.filter(m => {
        const matchesCategory = selectedCategory === 'All' || m.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              m.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              m.category?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-zinc-400 text-sm font-medium">Accessing study library vault...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <header className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="primary" size="sm" icon={BookOpen}>
                            Academic Knowledge Base
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">{materials.length} Materials Available</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                        Study Material Library
                    </h1>
                    <p className="mt-1 text-zinc-400 text-sm">
                        Download lecture presentations, laboratory guides, syllabus PDFs, and coding assignments.
                    </p>
                </div>
                {isFaculty && (
                    <Button 
                        onClick={() => setShowUpload(!showUpload)}
                        variant={showUpload ? "outline" : "primary"}
                        icon={showUpload ? X : Plus}
                    >
                        {showUpload ? 'Close Upload Form' : 'Upload Material'}
                    </Button>
                )}
            </header>

            {/* Upload Modal / Form Drawer */}
            {showUpload && (
                <div>
                    <Card className="border-indigo-500/40 bg-zinc-900/90 p-8 shadow-2xl">
                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
                                    <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Upload New Study Resource</CardTitle>
                                        <CardDescription>Publish documents for student downloads and offline study.</CardDescription>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Material Title"
                                        required
                                        placeholder="e.g. Data Structures Full Notes - Unit 1 & 2"
                                        value={newMaterial.title}
                                        onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                    />
                                    <Input
                                        label="Category / Technology"
                                        required
                                        placeholder="e.g. Algorithms, React, Cloud Computing, Database"
                                        value={newMaterial.category}
                                        onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                                    />
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 transition h-24"
                                            placeholder="Provide a short synopsis or lecture reference..."
                                            value={newMaterial.description}
                                            onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                                            File Attachment (PDF, DOCX, ZIP, PPTX)
                                        </label>
                                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-800 hover:border-indigo-500/60 rounded-2xl cursor-pointer bg-zinc-950/60 transition group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-zinc-500 group-hover:text-indigo-400 mb-2 transition" />
                                                <p className="text-xs text-zinc-400 font-medium">
                                                    {newMaterial.file ? (
                                                        <span className="text-emerald-400 font-bold">{newMaterial.file.name}</span>
                                                    ) : (
                                                        <span>Click to select file or drag & drop</span>
                                                    )}
                                                </p>
                                                <p className="text-[10px] text-zinc-600 mt-1">Maximum 50MB file size</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files[0] })} 
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button variant="ghost" onClick={() => setShowUpload(false)}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        loading={uploading}
                                        icon={Upload}
                                    >
                                        Publish to Library
                                    </Button>
                                </div>
                            </form>
                        </Card>
                </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                                selectedCategory === cat
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search materials by title..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((m) => (
                    <Card key={m._id} className="p-6 flex flex-col justify-between group hover:border-indigo-500/40">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <Badge variant="primary" size="sm">
                                    {m.category || 'General'}
                                </Badge>
                            </div>

                            <h3 className="text-lg font-bold text-zinc-100 group-hover:text-indigo-300 transition line-clamp-2 mb-2">
                                {m.title}
                            </h3>
                            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-6">
                                {m.description || 'Verified course document and study materials.'}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                            <a
                                href={`http://localhost:5000${m.fileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1"
                            >
                                <Button variant="outline" size="sm" className="w-full justify-center" icon={Download}>
                                    Download Document
                                </Button>
                            </a>
                            {isFaculty && (
                                <button
                                    onClick={() => handleDelete(m._id)}
                                    className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                                    title="Delete Material"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {filteredMaterials.length === 0 && (
                <div className="p-16 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-sm">
                    No study materials found matching your category or search query.
                </div>
            )}
        </div>
    );
};

export default MaterialLibrary;
