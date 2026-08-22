# CampusSphere ERP roadmap

Anubhav Kumar Ray

## Product scope

CampusSphere combines college administration, academics, learning, and grievance resolution. Existing `learner` and `trainer` accounts remain supported while the application is migrated to the ERP terminology: student and faculty.

## Roles

| Role              | Core responsibilities                                                       |
| ----------------- | --------------------------------------------------------------------------- |
| Student           | View attendance/results, submit work, use learning content, file complaints |
| Faculty           | Mark attendance, publish material, manage assignments and marks             |
| HOD               | Review department analytics and escalated complaints                        |
| Admin             | Manage people, departments, academic setup, notices, reports                |
| Placement officer | Manage job drives and applications                                          |

## Delivery phases

1. **Academic foundation** — departments, courses, subjects, enrollment and role migration.
2. **Student success** — attendance, exams/marks, SGPA/CGPA and health-score analytics.
3. **Learning** — materials, assignments, submissions, quizzes and doubt resolution.
4. **Campus operations** — notices, timetable, leave, library and fees.
5. **Grievance and careers** — complaints with SLA escalation, placement drives and notifications.
6. **Polish** — reports/exports, responsive UI, audit trail, validation and security review.

## Academic API foundation

- `GET/POST /api/academics/departments`
- `GET/POST /api/academics/courses?departmentId=`
- `GET/POST /api/academics/subjects?courseId=&semester=`
- `GET/POST /api/academics/enrollments` — admins connect a student to their course, department, semester and section.
- `POST /api/performance/attendance` — faculty/admin records one subject's class attendance in bulk.
- `POST /api/performance/marks` — faculty/admin enters or updates a student's assessment mark.
- `GET /api/performance/student/me` — student dashboard attendance, marks, alerts, and health score.

Create operations are restricted to admins. Read operations require a signed-in user.
