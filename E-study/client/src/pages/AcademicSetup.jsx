import React, { useEffect, useMemo, useState } from 'react';
import { 
    BookOpen, Building2, Loader2, Plus, School, 
    UserPlus, CheckCircle2, ChevronRight, Layers,
    GraduationCap, Sparkles, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

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
                api.get('/academics/departments'),
                api.get('/academics/courses'),
                api.get('/academics/subjects'),
                api.get('/admin/users')
            ]);
            setData({ 
                departments: departmentResponse.data, 
                courses: courseResponse.data, 
                subjects: subjectResponse.data, 
                users: usersResponse.data 
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to load academic setup data');
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
            toast.success(`${key} registered successfully`);
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
        if (target === 'subject') {
            setSubjectForm({ ...subjectForm, courseId });
        } else {
            setEnrollmentForm({ ...enrollmentForm, courseId, departmentId: course?.departmentId?._id || '' });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-zinc-400 text-sm font-medium">Loading institutional setup wizard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <header className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="warning" size="sm" icon={Layers}>
                            University Configuration
                        </Badge>
                        <span className="text-xs text-zinc-500 font-mono">Setup Wizard</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
                        Academic Structure Builder
                    </h1>
                    <p className="mt-1 text-zinc-400 text-sm">
                        Configure institutional architecture in sequence: <strong>Department → Course → Subject → Student Enrollment</strong>.
                    </p>
                </div>
            </header>

            {/* Wizard Steps Summary Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase font-semibold text-zinc-400">1. Departments</p>
                        <p className="text-2xl font-black text-indigo-400 mt-0.5">{data.departments.length}</p>
                    </div>
                    <Building2 className="w-6 h-6 text-indigo-400/50" />
                </div>
                <div className="p-4 rounded-2xl border border-pink-500/30 bg-pink-500/5 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase font-semibold text-zinc-400">2. Courses</p>
                        <p className="text-2xl font-black text-pink-400 mt-0.5">{data.courses.length}</p>
                    </div>
                    <School className="w-6 h-6 text-pink-400/50" />
                </div>
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase font-semibold text-zinc-400">3. Subjects</p>
                        <p className="text-2xl font-black text-emerald-400 mt-0.5">{data.subjects.length}</p>
                    </div>
                    <BookOpen className="w-6 h-6 text-emerald-400/50" />
                </div>
                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase font-semibold text-zinc-400">4. Students</p>
                        <p className="text-2xl font-black text-amber-400 mt-0.5">{students.length}</p>
                    </div>
                    <UserPlus className="w-6 h-6 text-amber-400/50" />
                </div>
            </div>

            {/* 4 Setup Step Cards in 2x2 Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Step 1: Departments */}
                <Card className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-zinc-800">
                            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Step 1: Register Department</CardTitle>
                                <CardDescription>Example: Computer Science & Engineering (CSE)</CardDescription>
                            </div>
                        </div>

                        <form onSubmit={(e) => submit(e, '/academics/departments', departmentForm, setDepartmentForm, { name: '', code: '', description: '' }, 'Department')} className="space-y-4">
                            <Input
                                label="Department Name"
                                required
                                placeholder="Computer Science & Engineering"
                                value={departmentForm.name}
                                onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                            />
                            <Input
                                label="Department Code"
                                required
                                placeholder="CSE"
                                value={departmentForm.code}
                                onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value.toUpperCase() })}
                            />
                            <Input
                                label="Overview / Description"
                                placeholder="Faculty of Computing & IT"
                                value={departmentForm.description}
                                onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })}
                            />

                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-full justify-center" 
                                loading={saving === 'Department'}
                                icon={Plus}
                            >
                                Create Department
                            </Button>
                        </form>
                    </div>

                    {/* Existing Departments List */}
                    <div className="mt-6 pt-4 border-t border-zinc-800">
                        <p className="text-xs font-semibold text-zinc-400 uppercase mb-2">Registered Departments ({data.departments.length})</p>
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                            {data.departments.map((item) => (
                                <div key={item._id} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs flex justify-between items-center">
                                    <span className="font-semibold text-zinc-200">{item.name}</span>
                                    <Badge size="sm" variant="primary">{item.code}</Badge>
                                </div>
                            ))}
                            {!data.departments.length && (
                                <p className="text-xs text-zinc-500 italic p-2">No departments created yet.</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Step 2: Courses */}
                <Card className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-zinc-800">
                            <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
                                <School className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Step 2: Add Degree Course</CardTitle>
                                <CardDescription>Connect a degree programme to its parent department.</CardDescription>
                            </div>
                        </div>

                        <form onSubmit={(e) => submit(e, '/academics/courses', courseForm, setCourseForm, { name: '', code: '', departmentId: '', durationYears: 4, totalSemesters: 8 }, 'Course')} className="space-y-4">
                            <Input
                                label="Course Name"
                                required
                                placeholder="B.Tech Computer Science"
                                value={courseForm.name}
                                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                            />
                            <Input
                                label="Course Code"
                                required
                                placeholder="BTECH-CSE"
                                value={courseForm.code}
                                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                            />
                            <Select
                                label="Parent Department"
                                required
                                value={courseForm.departmentId}
                                onChange={(e) => setCourseForm({ ...courseForm, departmentId: e.target.value })}
                                options={data.departments.map((d) => ({
                                    value: d._id,
                                    label: `${d.name} (${d.code})`
                                }))}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Duration (Years)"
                                    type="number"
                                    min="1"
                                    max="6"
                                    required
                                    value={courseForm.durationYears}
                                    onChange={(e) => setCourseForm({ ...courseForm, durationYears: Number(e.target.value) })}
                                />
                                <Input
                                    label="Total Semesters"
                                    type="number"
                                    min="1"
                                    max="12"
                                    required
                                    value={courseForm.totalSemesters}
                                    onChange={(e) => setCourseForm({ ...courseForm, totalSemesters: Number(e.target.value) })}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                variant="secondary" 
                                className="w-full justify-center" 
                                loading={saving === 'Course'}
                                icon={Plus}
                            >
                                Create Course Programme
                            </Button>
                        </form>
                    </div>

                    {/* Existing Courses List */}
                    <div className="mt-6 pt-4 border-t border-zinc-800">
                        <p className="text-xs font-semibold text-zinc-400 uppercase mb-2">Registered Courses ({data.courses.length})</p>
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                            {data.courses.map((item) => (
                                <div key={item._id} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs flex justify-between items-center">
                                    <span className="font-semibold text-zinc-200">{item.name}</span>
                                    <div className="flex items-center gap-1.5">
                                        <Badge size="sm" variant="secondary">{item.code}</Badge>
                                        <span className="text-[10px] text-zinc-500 font-mono">{item.totalSemesters} Sems</span>
                                    </div>
                                </div>
                            ))}
                            {!data.courses.length && (
                                <p className="text-xs text-zinc-500 italic p-2">No courses created yet.</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Step 3: Subjects & Faculty Assignment */}
                <Card className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-zinc-800">
                            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Step 3: Create & Assign Subject</CardTitle>
                                <CardDescription>Add credit modules and assign to designated faculty.</CardDescription>
                            </div>
                        </div>

                        <form onSubmit={(e) => submit(e, '/academics/subjects', subjectForm, setSubjectForm, { name: '', code: '', courseId: '', semester: 1, credits: 3, facultyId: '', type: 'theory' }, 'Subject')} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Subject Name"
                                    required
                                    placeholder="Data Structures"
                                    value={subjectForm.name}
                                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                                />
                                <Input
                                    label="Subject Code"
                                    required
                                    placeholder="CSE301"
                                    value={subjectForm.code}
                                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <Select
                                label="Course Programme"
                                required
                                value={subjectForm.courseId}
                                onChange={(e) => handleCourseChange(e.target.value, 'subject')}
                                options={data.courses.map((c) => ({
                                    value: c._id,
                                    label: `${c.name} (${c.code})`
                                }))}
                            />

                            <Select
                                label="Assigned Faculty"
                                value={subjectForm.facultyId}
                                onChange={(e) => setSubjectForm({ ...subjectForm, facultyId: e.target.value })}
                                options={faculty.map((f) => ({
                                    value: f._id,
                                    label: `${f.name} (${f.email})`
                                }))}
                            />

                            <div className="grid grid-cols-3 gap-3">
                                <Input
                                    label="Semester"
                                    type="number"
                                    min="1"
                                    max="12"
                                    required
                                    value={subjectForm.semester}
                                    onChange={(e) => setSubjectForm({ ...subjectForm, semester: Number(e.target.value) })}
                                />
                                <Input
                                    label="Credits"
                                    type="number"
                                    min="1"
                                    max="10"
                                    required
                                    value={subjectForm.credits}
                                    onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })}
                                />
                                <Select
                                    label="Type"
                                    value={subjectForm.type}
                                    onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value })}
                                    options={[
                                        { value: 'theory', label: 'Theory' },
                                        { value: 'practical', label: 'Lab / Practical' },
                                        { value: 'project', label: 'Project' }
                                    ]}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                variant="success" 
                                className="w-full justify-center" 
                                loading={saving === 'Subject'}
                                icon={Plus}
                            >
                                Register Subject
                            </Button>
                        </form>
                    </div>

                    {/* Existing Subjects List */}
                    <div className="mt-6 pt-4 border-t border-zinc-800">
                        <p className="text-xs font-semibold text-zinc-400 uppercase mb-2">Registered Subjects ({data.subjects.length})</p>
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                            {data.subjects.map((item) => (
                                <div key={item._id} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs flex justify-between items-center">
                                    <span className="font-semibold text-zinc-200">{item.name} <span className="text-zinc-500 font-mono">({item.code})</span></span>
                                    <Badge size="sm" variant="success">Sem {item.semester}</Badge>
                                </div>
                            ))}
                            {!data.subjects.length && (
                                <p className="text-xs text-zinc-500 italic p-2">No subjects created yet.</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Step 4: Student Enrollment */}
                <Card className="p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-zinc-800">
                            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Step 4: Enroll Student</CardTitle>
                                <CardDescription>Link a student account to programme, semester, and section.</CardDescription>
                            </div>
                        </div>

                        <form onSubmit={(e) => submit(e, '/academics/enrollments', enrollmentForm, setEnrollmentForm, { studentId: '', courseId: '', departmentId: '', enrollmentNumber: '', currentSemester: 1, section: '', batchYear: new Date().getFullYear() }, 'Enrollment')} className="space-y-4">
                            <Select
                                label="Student Account"
                                required
                                value={enrollmentForm.studentId}
                                onChange={(e) => setEnrollmentForm({ ...enrollmentForm, studentId: e.target.value })}
                                options={students.map((s) => ({
                                    value: s._id,
                                    label: `${s.name} (${s.email})`
                                }))}
                            />

                            <Select
                                label="Target Course"
                                required
                                value={enrollmentForm.courseId}
                                onChange={(e) => handleCourseChange(e.target.value, 'enrollment')}
                                options={data.courses.map((c) => ({
                                    value: c._id,
                                    label: `${c.name} (${c.code})`
                                }))}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Enrollment Roll No"
                                    required
                                    placeholder="2026CSE001"
                                    value={enrollmentForm.enrollmentNumber}
                                    onChange={(e) => setEnrollmentForm({ ...enrollmentForm, enrollmentNumber: e.target.value.toUpperCase() })}
                                />
                                <Input
                                    label="Semester"
                                    type="number"
                                    min="1"
                                    max="12"
                                    required
                                    value={enrollmentForm.currentSemester}
                                    onChange={(e) => setEnrollmentForm({ ...enrollmentForm, currentSemester: Number(e.target.value) })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Section"
                                    placeholder="A, B, or C"
                                    value={enrollmentForm.section}
                                    onChange={(e) => setEnrollmentForm({ ...enrollmentForm, section: e.target.value.toUpperCase() })}
                                />
                                <Input
                                    label="Batch Year"
                                    type="number"
                                    value={enrollmentForm.batchYear}
                                    onChange={(e) => setEnrollmentForm({ ...enrollmentForm, batchYear: Number(e.target.value) })}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                variant="warning" 
                                className="w-full justify-center text-zinc-950 font-bold" 
                                loading={saving === 'Enrollment'}
                                icon={Plus}
                            >
                                Enroll Student in Roster
                            </Button>
                        </form>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                        <span>Students available: <strong>{students.length}</strong></span>
                        <span>Faculty assigned: <strong>{faculty.length}</strong></span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AcademicSetup;
