import React, { useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, CalendarCheck, ClipboardPenLine, Loader2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

const today = new Date().toISOString().slice(0, 10);

const FacultyAcademicManager = () => {
    const [subjects, setSubjects] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [activeTab, setActiveTab] = useState('attendance');
    const [date, setDate] = useState(today);
    const [attendance, setAttendance] = useState({});
    const [markForm, setMarkForm] = useState({ studentId: '', examName: '', examType: 'internal', semester: 1, score: '', maximumScore: '' });
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
    const students = useMemo(() => enrollments.filter((item) => item.courseId?._id === selectedSubject?.courseId?._id && item.currentSemester === selectedSubject?.semester), [enrollments, selectedSubject]);

    useEffect(() => {
        setAttendance(Object.fromEntries(students.map((item) => [item.studentId._id, 'present'])));
        setMarkForm((current) => ({ ...current, studentId: students[0]?.studentId?._id || '', semester: selectedSubject?.semester || 1 }));
    }, [selectedSubjectId, enrollments.length]);

    const changeSubject = (event) => {
        const subject = subjects.find((item) => item._id === event.target.value);
        setSelectedSubjectId(event.target.value);
        setMarkForm((current) => ({ ...current, semester: subject?.semester || 1 }));
    };

    const saveAttendance = async (event) => {
        event.preventDefault();
        if (!students.length) return toast.error('No enrolled students were found for this subject and semester');
        setSaving(true);
        try {
            await api.post('/performance/attendance', {
                subjectId: selectedSubjectId,
                date,
                records: students.map((item) => ({ studentId: item.studentId._id, status: attendance[item.studentId._id] || 'present' }))
            });
            toast.success('Attendance saved successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to save attendance');
        } finally {
            setSaving(false);
        }
    };

    const saveMark = async (event) => {
        event.preventDefault();
        if (!markForm.studentId) return toast.error('Select a student first');
        setSaving(true);
        try {
            await api.post('/performance/marks', { ...markForm, subjectId: selectedSubjectId, score: Number(markForm.score), maximumScore: Number(markForm.maximumScore) });
            toast.success('Marks saved successfully');
            setMarkForm((current) => ({ ...current, score: '', maximumScore: '' }));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to save marks');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="max-w-5xl space-y-8 pb-10">
            <header>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary-light">Faculty Workspace</p>
                <h2 className="text-4xl font-extrabold">Academic Manager</h2>
                <p className="mt-2 text-slate-400">Record attendance and publish student assessment marks.</p>
            </header>

            <section className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
                <label className="mb-2 block text-sm font-semibold text-slate-300">Assigned subject</label>
                <select value={selectedSubjectId} onChange={changeSubject} className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 outline-none focus:border-primary">
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.code} — {subject.name} (Semester {subject.semester})</option>)}
                </select>
                {!subjects.length && <p className="mt-3 text-sm text-amber-300">No subjects have been configured yet. Ask an admin to create a department, course, and subject first.</p>}
            </section>

            {selectedSubject && <>
                <div className="flex gap-3 border-b border-slate-700">
                    <TabButton active={activeTab === 'attendance'} icon={<CalendarCheck size={17} />} label="Attendance" onClick={() => setActiveTab('attendance')} />
                    <TabButton active={activeTab === 'marks'} icon={<ClipboardPenLine size={17} />} label="Marks Entry" onClick={() => setActiveTab('marks')} />
                </div>

                {activeTab === 'attendance' ? (
                    <form onSubmit={saveAttendance} className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <h3 className="text-xl font-bold">Mark Attendance</h3>
                                <p className="text-sm text-slate-400">{selectedSubject.name} · Semester {selectedSubject.semester}</p>
                            </div>
                            <label className="text-sm text-slate-400">Class date<input type="date" required value={date} onChange={(event) => setDate(event.target.value)} className="mt-1 block rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-200" /></label>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-slate-700">
                            <table className="w-full min-w-[600px] text-left text-sm">
                                <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4">Student</th><th className="p-4">Enrollment no.</th><th className="p-4">Status</th></tr></thead>
                                <tbody className="divide-y divide-slate-700">
                                    {students.map((item) => <tr key={item._id}><td className="p-4 font-semibold">{item.studentId.name}<div className="text-xs font-normal text-slate-500">{item.studentId.email}</div></td><td className="p-4 font-mono text-slate-400">{item.enrollmentNumber}</td><td className="p-4"><select value={attendance[item.studentId._id] || 'present'} onChange={(event) => setAttendance({ ...attendance, [item.studentId._id]: event.target.value })} className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2"><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option><option value="excused">Excused</option></select></td></tr>)}
                                </tbody>
                            </table>
                        </div>
                        {!students.length && <p className="mt-5 text-center text-sm text-slate-500">No students are enrolled in this subject's course and semester.</p>}
                        <button disabled={saving || !students.length} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"><Save size={18} />{saving ? 'Saving…' : 'Save Attendance'}</button>
                    </form>
                ) : (
                    <form onSubmit={saveMark} className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
                        <div className="mb-6 flex items-center gap-3"><BookOpenCheck className="text-secondary-light" /><div><h3 className="text-xl font-bold">Enter Assessment Marks</h3><p className="text-sm text-slate-400">A previous entry with the same assessment name will be updated.</p></div></div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Field label="Student"><select required value={markForm.studentId} onChange={(event) => setMarkForm({ ...markForm, studentId: event.target.value })}>{students.map((item) => <option key={item.studentId._id} value={item.studentId._id}>{item.studentId.name} — {item.enrollmentNumber}</option>)}</select></Field>
                            <Field label="Assessment name"><input required placeholder="e.g. Internal Test 1" value={markForm.examName} onChange={(event) => setMarkForm({ ...markForm, examName: event.target.value })} /></Field>
                            <Field label="Assessment type"><select value={markForm.examType} onChange={(event) => setMarkForm({ ...markForm, examType: event.target.value })}>{['internal', 'mid_sem', 'end_sem', 'practical', 'assignment', 'quiz'].map((type) => <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>)}</select></Field>
                            <Field label="Semester"><input type="number" min="1" max="16" required value={markForm.semester} onChange={(event) => setMarkForm({ ...markForm, semester: event.target.value })} /></Field>
                            <Field label="Marks obtained"><input type="number" min="0" step="0.01" required value={markForm.score} onChange={(event) => setMarkForm({ ...markForm, score: event.target.value })} /></Field>
                            <Field label="Maximum marks"><input type="number" min="1" step="0.01" required value={markForm.maximumScore} onChange={(event) => setMarkForm({ ...markForm, maximumScore: event.target.value })} /></Field>
                        </div>
                        {!students.length && <p className="mt-5 text-sm text-amber-300">Enroll students before entering marks.</p>}
                        <button disabled={saving || !students.length} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 font-bold text-white transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-50"><Save size={18} />{saving ? 'Saving…' : 'Publish Marks'}</button>
                    </form>
                )}
            </>}
        </div>
    );
};

const TabButton = ({ active, icon, label, onClick }) => <button onClick={onClick} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ${active ? 'border-primary text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>{icon}{label}</button>;
const Field = ({ label, children }) => <label className="block text-sm font-semibold text-slate-300">{label}<span className="mt-2 block [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-700 [&_input]:bg-slate-900 [&_input]:p-3 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-slate-700 [&_select]:bg-slate-900 [&_select]:p-3">{children}</span></label>;

export default FacultyAcademicManager;
