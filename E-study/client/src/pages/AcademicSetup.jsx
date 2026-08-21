import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Building2, Loader2, Plus, School, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

const AcademicSetup = () => {
    const [data, setData] = useState({ departments: [], courses: [], subjects: [], users: [] });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState('');
    const [departmentForm, setDepartmentForm] = useState({ name: '', code: '', description: '' });
    const [courseForm, setCourseForm] = useState({ name: '', code: '', departmentId: '', durationYears: 4, totalSemesters: 8 });
    const [subjectForm, setSubjectForm] = useState({ name: '', code: '', courseId: '', semester: 1, credits: 3, facultyId: '', type: 'theory' });
    const [enrollmentForm, setEnrollmentForm] = useState({ studentId: '', courseId: '', departmentId: '', enrollmentNumber: '', currentSemester: 1, section: '', batchYear: new Date().getFullYear() });

    const loadData = async () => {
        try {
            const [departmentResponse, courseResponse, subjectResponse, usersResponse] = await Promise.all([
                api.get('/academics/departments'), api.get('/academics/courses'), api.get('/academics/subjects'), api.get('/admin/users')
            ]);
            setData({ departments: departmentResponse.data, courses: courseResponse.data, subjects: subjectResponse.data, users: usersResponse.data });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to load academic setup');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const faculty = useMemo(() => data.users.filter((user) => ['faculty', 'trainer'].includes(user.role)), [data.users]);
    const students = useMemo(() => data.users.filter((user) => ['student', 'learner'].includes(user.role)), [data.users]);

    const submit = async (event, endpoint, payload, setForm, initialForm, key) => {
        event.preventDefault();
        setSaving(key);
        try {
            await api.post(endpoint, payload);
            toast.success(`${key} created successfully`);
            setForm(initialForm);
            await loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || `Unable to create ${key}`);
        } finally {
            setSaving('');
        }
    };

    const handleCourseChange = (courseId, target) => {
        const course = data.courses.find((item) => item._id === courseId);
        if (target === 'subject') setSubjectForm({ ...subjectForm, courseId });
        else setEnrollmentForm({ ...enrollmentForm, courseId, departmentId: course?.departmentId?._id || '' });
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8 pb-10">
            <header>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-primary-light">Administrator workspace</p>
                <h2 className="text-4xl font-extrabold">Academic Setup</h2>
                <p className="mt-2 text-slate-400">Set up the academic structure in this order: department → course → subject → student enrollment.</p>
            </header>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                <SetupCard icon={<Building2 />} title="1. Add Department" description="Example: Computer Science & Engineering">
                    <form onSubmit={(event) => submit(event, '/academics/departments', departmentForm, setDepartmentForm, { name: '', code: '', description: '' }, 'Department')} className="space-y-4">
                        <FormInput label="Department name" value={departmentForm.name} onChange={(event) => setDepartmentForm({ ...departmentForm, name: event.target.value })} placeholder="Computer Science & Engineering" />
                        <FormInput label="Department code" value={departmentForm.code} onChange={(event) => setDepartmentForm({ ...departmentForm, code: event.target.value.toUpperCase() })} placeholder="CSE" />
                        <FormInput label="Description (optional)" required={false} value={departmentForm.description} onChange={(event) => setDepartmentForm({ ...departmentForm, description: event.target.value })} placeholder="Department overview" />
                        <SaveButton loading={saving === 'Department'} label="Create Department" />
                    </form>
                    <List items={data.departments} empty="No departments added yet." render={(item) => <><b>{item.name}</b><span>{item.code}</span></>} />
                </SetupCard>

                <SetupCard icon={<School />} title="2. Add Course" description="Connect a programme to its department.">
                    <form onSubmit={(event) => submit(event, '/academics/courses', courseForm, setCourseForm, { name: '', code: '', departmentId: '', durationYears: 4, totalSemesters: 8 }, 'Course')} className="space-y-4">
                        <FormInput label="Course name" value={courseForm.name} onChange={(event) => setCourseForm({ ...courseForm, name: event.target.value })} placeholder="B.Tech Computer Science" />
                        <FormInput label="Course code" value={courseForm.code} onChange={(event) => setCourseForm({ ...courseForm, code: event.target.value.toUpperCase() })} placeholder="BTECH-CSE" />
                        <FormSelect label="Department" value={courseForm.departmentId} onChange={(event) => setCourseForm({ ...courseForm, departmentId: event.target.value })} options={data.departments.map((item) => ({ value: item._id, label: `${item.name} (${item.code})` }))} />
                        <div className="grid grid-cols-2 gap-4"><FormInput label="Duration (years)" type="number" value={courseForm.durationYears} onChange={(event) => setCourseForm({ ...courseForm, durationYears: Number(event.target.value) })} /><FormInput label="Total semesters" type="number" value={courseForm.totalSemesters} onChange={(event) => setCourseForm({ ...courseForm, totalSemesters: Number(event.target.value) })} /></div>
                        <SaveButton loading={saving === 'Course'} label="Create Course" />
                    </form>
                    <List items={data.courses} empty="No courses added yet." render={(item) => <><b>{item.name}</b><span>{item.code} · {item.departmentId?.code}</span></>} />
                </SetupCard>

                <SetupCard icon={<BookOpen />} title="3. Add & Assign Subject" description="Assign a faculty member while creating a subject.">
                    <form onSubmit={(event) => submit(event, '/academics/subjects', subjectForm, setSubjectForm, { name: '', code: '', courseId: '', semester: 1, credits: 3, facultyId: '', type: 'theory' }, 'Subject')} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4"><FormInput label="Subject name" value={subjectForm.name} onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })} placeholder="Data Structures" /><FormInput label="Subject code" value={subjectForm.code} onChange={(event) => setSubjectForm({ ...subjectForm, code: event.target.value.toUpperCase() })} placeholder="CSE201" /></div>
                        <FormSelect label="Course" value={subjectForm.courseId} onChange={(event) => handleCourseChange(event.target.value, 'subject')} options={data.courses.map((item) => ({ value: item._id, label: `${item.name} (${item.code})` }))} />
                        <FormSelect label="Faculty" value={subjectForm.facultyId} onChange={(event) => setSubjectForm({ ...subjectForm, facultyId: event.target.value })} options={faculty.map((item) => ({ value: item._id, label: `${item.name} (${item.uniqueId || item.email})` }))} />
                        <div className="grid grid-cols-3 gap-4"><FormInput label="Semester" type="number" value={subjectForm.semester} onChange={(event) => setSubjectForm({ ...subjectForm, semester: Number(event.target.value) })} /><FormInput label="Credits" type="number" value={subjectForm.credits} onChange={(event) => setSubjectForm({ ...subjectForm, credits: Number(event.target.value) })} /><FormSelect label="Type" value={subjectForm.type} onChange={(event) => setSubjectForm({ ...subjectForm, type: event.target.value })} options={['theory', 'practical', 'project'].map((item) => ({ value: item, label: item }))} /></div>
                        <SaveButton loading={saving === 'Subject'} label="Create Subject" />
                    </form>
                    <List items={data.subjects} empty="No subjects added yet." render={(item) => <><b>{item.name}</b><span>Sem {item.semester} · {item.courseId?.code} · {item.facultyId?.name || 'Unassigned'}</span></>} />
                </SetupCard>

                <SetupCard icon={<UserPlus />} title="4. Enroll Student" description="Add the student to the correct programme, semester, and section.">
                    <form onSubmit={(event) => submit(event, '/academics/enrollments', enrollmentForm, setEnrollmentForm, { studentId: '', courseId: '', departmentId: '', enrollmentNumber: '', currentSemester: 1, section: '', batchYear: new Date().getFullYear() }, 'Enrollment')} className="space-y-4">
                        <FormSelect label="Student" value={enrollmentForm.studentId} onChange={(event) => setEnrollmentForm({ ...enrollmentForm, studentId: event.target.value })} options={students.map((item) => ({ value: item._id, label: `${item.name} (${item.email})` }))} />
                        <FormSelect label="Course" value={enrollmentForm.courseId} onChange={(event) => handleCourseChange(event.target.value, 'enrollment')} options={data.courses.map((item) => ({ value: item._id, label: `${item.name} (${item.code})` }))} />
                        <div className="grid grid-cols-2 gap-4"><FormInput label="Enrollment number" value={enrollmentForm.enrollmentNumber} onChange={(event) => setEnrollmentForm({ ...enrollmentForm, enrollmentNumber: event.target.value.toUpperCase() })} placeholder="2026CSE001" /><FormInput label="Semester" type="number" value={enrollmentForm.currentSemester} onChange={(event) => setEnrollmentForm({ ...enrollmentForm, currentSemester: Number(event.target.value) })} /></div>
                        <div className="grid grid-cols-2 gap-4"><FormInput label="Section" value={enrollmentForm.section} onChange={(event) => setEnrollmentForm({ ...enrollmentForm, section: event.target.value.toUpperCase() })} placeholder="A" /><FormInput label="Batch year" type="number" value={enrollmentForm.batchYear} onChange={(event) => setEnrollmentForm({ ...enrollmentForm, batchYear: Number(event.target.value) })} /></div>
                        <SaveButton loading={saving === 'Enrollment'} label="Enroll Student" />
                    </form>
                    <p className="mt-5 text-xs text-slate-500">Students available: {students.length} · Faculty available: {faculty.length}</p>
                </SetupCard>
            </div>
        </div>
    );
};

const SetupCard = ({ icon, title, description, children }) => <section className="rounded-2xl border border-slate-700 bg-slate-800 p-6"><div className="mb-5 flex items-start gap-3"><span className="rounded-xl bg-primary/15 p-3 text-primary-light">{icon}</span><div><h3 className="text-xl font-bold">{title}</h3><p className="text-sm text-slate-400">{description}</p></div></div>{children}</section>;
const FormInput = ({ label, required = true, ...props }) => <label className="block text-sm font-semibold text-slate-300">{label}<input required={required} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-normal outline-none focus:border-primary" {...props} /></label>;
const FormSelect = ({ label, options, ...props }) => <label className="block text-sm font-semibold text-slate-300">{label}<select required className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-normal outline-none focus:border-primary" {...props}><option value="">Select {label.toLowerCase()}</option>{options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>;
const SaveButton = ({ loading, label }) => <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:bg-primary-dark disabled:opacity-50">{loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}{loading ? 'Saving…' : label}</button>;
const List = ({ items, empty, render }) => <div className="mt-5 max-h-36 space-y-2 overflow-y-auto border-t border-slate-700 pt-4">{items.length ? items.map((item) => <div key={item._id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-900/70 px-3 py-2 text-xs"><span>{render(item)}</span></div>) : <p className="text-sm text-slate-500">{empty}</p>}</div>;

export default AcademicSetup;
