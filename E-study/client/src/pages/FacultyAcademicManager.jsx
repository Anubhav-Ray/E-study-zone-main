import React, { useEffect, useMemo, useState } from 'react';
import { 
    BookOpenCheck, CalendarCheck, ClipboardPenLine, 
    Loader2, Save, Users, CheckCircle2, UserCheck, 
    Calendar, Sparkles, BookOpen, Clock, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';

const today = new Date().toISOString().slice(0, 10);

const FacultyAcademicManager = () => {
    const [subjects, setSubjects] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [activeTab, setActiveTab] = useState('attendance');
    const [date, setDate] = useState(today);
    const [attendance, setAttendance] = useState({});
    const [markForm, setMarkForm] = useState({ 
        studentId: '', 
        examName: '', 
        examType: 'internal', 
        semester: 1, 
        score: '', 
        maximumScore: '' 
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadAcademicData = async () => {
            try {
                const [subjectsResponse, enrollmentsResponse] = await Promise.all([
                    api.get('/academics/subjects'),
                    api.get('/academics/enrollments')
                ]);
                setSubjects(subjectsResponse.data);
                setEnrollments(enrollmentsResponse.data);
                if (subjectsResponse.data.length) {
                    const firstSubject = subjectsResponse.data[0];
                    setSelectedSubjectId(firstSubject._id);
                    setMarkForm((current) => ({ ...current, semester: firstSubject.semester }));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Unable to load academic data');
            } finally {
                setLoading(false);
            }
        };
        loadAcademicData();
    }, []);

    const selectedSubject = subjects.find((subject) => subject._id === selectedSubjectId);
    
    const students = useMemo(() => {
        return enrollments.filter(
            (item) => item.courseId?._id === selectedSubject?.courseId?._id && 
                      item.currentSemester === selectedSubject?.semester
        );
    }, [enrollments, selectedSubject]);

    useEffect(() => {
        if (students.length) {
            setAttendance(Object.fromEntries(students.map((item) => [item.studentId._id, 'present'])));
            setMarkForm((current) => ({ 
                ...current, 
                studentId: students[0]?.studentId?._id || '', 
                semester: selectedSubject?.semester || 1 
            }));
        }
    }, [selectedSubjectId, enrollments.length, students.length]);

    const changeSubject = (e) => {
        const subId = e.target.value;
        const subject = subjects.find((item) => item._id === subId);
        setSelectedSubjectId(subId);
        setMarkForm((current) => ({ ...current, semester: subject?.semester || 1 }));
    };

    const markAllStatus = (status) => {
        const updated = {};
        students.forEach((item) => {
            updated[item.studentId._id] = status;
        });
        setAttendance(updated);
        toast.success(`Marked all students as ${status.toUpperCase()}`);
    };

    const saveAttendance = async (e) => {
        e.preventDefault();
        if (!students.length) return toast.error('No enrolled students found for this subject and semester');
        setSaving(true);
        try {
            await api.post('/performance/attendance', {
                subjectId: selectedSubjectId,
                date,
                records: students.map((item) => ({
                    studentId: item.studentId._id,
                    status: attendance[item.studentId._id] || 'present'
                }))
            });
            toast.success('Attendance records saved successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to save attendance');
        } finally {
            setSaving(false);
        }
    };

    const saveMark = async (e) => {
        e.preventDefault();
        if (!markForm.studentId) return toast.error('Select a student first');
        if (Number(markForm.score) > Number(markForm.maximumScore)) {
            return toast.error('Obtained score cannot exceed maximum score');
        }
        setSaving(true);
        try {
            await api.post('/performance/marks', {
                ...markForm,
                subjectId: selectedSubjectId,
                score: Number(markForm.score),
                maximumScore: Number(markForm.maximumScore)
            });
            toast.success('Assessment marks published successfully');
            setMarkForm((current) => ({ ...current, score: '', maximumScore: '' }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to save marks');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-zinc-400 text-sm font-medium">Loading faculty academic roster...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-16">
            {/* Header */}
            <header className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="secondary" size="sm" icon={ClipboardPenLine}>
                            Faculty Operations Hub
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">Academic Manager</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                        Class Attendance & Marks
                    </h1>
                    <p className="mt-1 text-zinc-400 text-sm">
                        Record daily lecture attendance, track absent students, and enter semester assessment marks.
                    </p>
                </div>
            </header>

            {/* Subject Selector Bar */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                            Assigned Course Subject
                        </label>
                        <select 
                            value={selectedSubjectId} 
                            onChange={changeSubject}
                            className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition"
                        >
                            <option value="">Choose a subject...</option>
                            {subjects.map((sub) => (
                                <option key={sub._id} value={sub._id} className="bg-zinc-900 text-zinc-100">
                                    {sub.code} — {sub.name} (Semester {sub.semester})
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedSubject && (
                        <div className="flex items-center gap-3 self-end">
                            <div className="text-right">
                                <p className="text-xs font-semibold text-zinc-400 uppercase">Enrolled Students</p>
                                <p className="text-2xl font-extrabold text-indigo-400">{students.length}</p>
                            </div>
                        </div>
                    )}
                </div>

                {!subjects.length && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>No subjects have been configured yet. Ask a college admin to create departments, courses, and subjects first in Academic Setup.</span>
                    </div>
                )}
            </Card>

            {selectedSubject && (
                <div className="space-y-6">
                    {/* Tab Switcher */}
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('attendance')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all ${
                                activeTab === 'attendance'
                                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                            }`}
                        >
                            <CalendarCheck className="w-4 h-4" />
                            <span>Lecture Attendance</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('marks')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all ${
                                activeTab === 'marks'
                                    ? 'bg-pink-600/20 text-pink-300 border border-pink-500/40 shadow-sm'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                            }`}
                        >
                            <BookOpenCheck className="w-4 h-4" />
                            <span>Assessment Marks Entry</span>
                        </button>
                    </div>

                    {/* Attendance Tab */}
                    {activeTab === 'attendance' ? (
                        <Card className="p-6">
                            <form onSubmit={saveAttendance} className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                                    <div>
                                        <CardTitle className="text-xl">Daily Lecture Attendance Roster</CardTitle>
                                        <CardDescription>
                                            {selectedSubject.name} ({selectedSubject.code}) · Semester {selectedSubject.semester}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="text-xs text-zinc-400 font-semibold flex items-center gap-2">
                                            <span>Date:</span>
                                            <input 
                                                type="date" 
                                                required 
                                                value={date} 
                                                onChange={(e) => setDate(e.target.value)} 
                                                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-indigo-500"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Quick Bulk Actions */}
                                {students.length > 0 && (
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs">
                                        <span className="text-zinc-400 font-medium">Quick Roster Actions:</span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                type="button" 
                                                onClick={() => markAllStatus('present')}
                                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold hover:bg-emerald-500/25 transition"
                                            >
                                                Mark All Present
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => markAllStatus('absent')}
                                                className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-300 border border-red-500/30 font-semibold hover:bg-red-500/25 transition"
                                            >
                                                Mark All Absent
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Roster Table */}
                                <div className="rounded-xl border border-zinc-800 overflow-hidden overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-zinc-950 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                                            <tr>
                                                <th className="p-4">Student</th>
                                                <th className="p-4">Enrollment Number</th>
                                                <th className="p-4 text-right">Attendance Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800/80 bg-zinc-900/30">
                                            {students.map((item) => (
                                                <tr key={item._id} className="hover:bg-zinc-800/30 transition">
                                                    <td className="p-4">
                                                        <div className="font-semibold text-zinc-200">{item.studentId?.name}</div>
                                                        <div className="text-xs text-zinc-500">{item.studentId?.email}</div>
                                                    </td>
                                                    <td className="p-4 font-mono text-xs text-zinc-400">
                                                        {item.enrollmentNumber}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <select
                                                            value={attendance[item.studentId?._id] || 'present'}
                                                            onChange={(e) => setAttendance({ ...attendance, [item.studentId._id]: e.target.value })}
                                                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold border outline-none cursor-pointer ${
                                                                (attendance[item.studentId?._id] || 'present') === 'present'
                                                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                                                    : (attendance[item.studentId?._id] || 'present') === 'absent'
                                                                    ? 'bg-red-500/15 text-red-300 border-red-500/30'
                                                                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                                            }`}
                                                        >
                                                            <option value="present" className="bg-zinc-900 text-zinc-100">Present</option>
                                                            <option value="absent" className="bg-zinc-900 text-zinc-100">Absent</option>
                                                            <option value="late" className="bg-zinc-900 text-zinc-100">Late</option>
                                                            <option value="excused" className="bg-zinc-900 text-zinc-100">Excused</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {!students.length && (
                                    <div className="p-8 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm">
                                        No students are currently enrolled in this subject's course and semester.
                                    </div>
                                )}

                                <div className="flex justify-end pt-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={!students.length}
                                        loading={saving}
                                        icon={Save}
                                    >
                                        Save Attendance Records
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    ) : (
                        <Card className="p-6">
                            <form onSubmit={saveMark} className="space-y-6">
                                <div className="flex items-center space-x-3 pb-4 border-b border-zinc-800">
                                    <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
                                        <BookOpenCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Publish Student Assessment Marks</CardTitle>
                                        <CardDescription>
                                            Enter examination, quiz, or internal assessment marks for enrolled students.
                                        </CardDescription>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Select
                                        label="Select Student"
                                        required
                                        value={markForm.studentId}
                                        onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })}
                                        options={students.map((item) => ({
                                            value: item.studentId?._id,
                                            label: `${item.studentId?.name} (${item.enrollmentNumber})`
                                        }))}
                                    />

                                    <Input
                                        label="Assessment Name"
                                        required
                                        placeholder="e.g. Mid-Term Exam 1, Quiz 2, Lab Practical"
                                        value={markForm.examName}
                                        onChange={(e) => setMarkForm({ ...markForm, examName: e.target.value })}
                                    />

                                    <Select
                                        label="Assessment Category"
                                        value={markForm.examType}
                                        onChange={(e) => setMarkForm({ ...markForm, examType: e.target.value })}
                                        options={[
                                            { value: 'internal', label: 'Internal Exam' },
                                            { value: 'mid_sem', label: 'Mid-Semester' },
                                            { value: 'end_sem', label: 'End-Semester' },
                                            { value: 'practical', label: 'Practical / Lab' },
                                            { value: 'assignment', label: 'Assignment' },
                                            { value: 'quiz', label: 'Class Quiz' }
                                        ]}
                                    />

                                    <Input
                                        label="Semester"
                                        type="number"
                                        min="1"
                                        max="16"
                                        required
                                        value={markForm.semester}
                                        onChange={(e) => setMarkForm({ ...markForm, semester: Number(e.target.value) })}
                                    />

                                    <Input
                                        label="Marks Obtained"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        placeholder="e.g. 42.5"
                                        value={markForm.score}
                                        onChange={(e) => setMarkForm({ ...markForm, score: e.target.value })}
                                    />

                                    <Input
                                        label="Maximum Total Marks"
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        required
                                        placeholder="e.g. 50"
                                        value={markForm.maximumScore}
                                        onChange={(e) => setMarkForm({ ...markForm, maximumScore: e.target.value })}
                                    />
                                </div>

                                {markForm.score && markForm.maximumScore && (
                                    <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">Score Preview:</span>
                                        <Badge 
                                            variant={(Number(markForm.score) / Number(markForm.maximumScore)) >= 0.75 ? "success" : "warning"}
                                            size="md"
                                        >
                                            {((Number(markForm.score) / Number(markForm.maximumScore)) * 100).toFixed(1)}% Percentage
                                        </Badge>
                                    </div>
                                )}

                                <div className="flex justify-end pt-2">
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        size="lg"
                                        disabled={!students.length}
                                        loading={saving}
                                        icon={Save}
                                    >
                                        Publish Assessment Marks
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default FacultyAcademicManager;
