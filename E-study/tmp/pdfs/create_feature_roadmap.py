from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output" / "pdf" / "CampusSphere_Feature_Roadmap.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#0F172A")
PANEL = colors.HexColor("#1E293B")
INDIGO = colors.HexColor("#4F46E5")
CYAN = colors.HexColor("#22D3EE")
AMBER = colors.HexColor("#FBBF24")
TEXT = colors.HexColor("#182033")
MUTED = colors.HexColor("#64748B")
LINE = colors.HexColor("#CBD5E1")
WHITE = colors.white

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=32, leading=38, textColor=NAVY, alignment=TA_CENTER, spaceAfter=12))
styles.add(ParagraphStyle(name="CoverSub", parent=styles["BodyText"], fontName="Helvetica", fontSize=13, leading=20, textColor=MUTED, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="Section", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=20, leading=25, textColor=NAVY, spaceBefore=0, spaceAfter=12))
styles.add(ParagraphStyle(name="Subsection", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=12, leading=16, textColor=INDIGO, spaceBefore=10, spaceAfter=5))
styles.add(ParagraphStyle(name="Body", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.5, leading=14, textColor=TEXT, spaceAfter=5))
styles.add(ParagraphStyle(name="BulletItem", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.2, leading=13.5, textColor=TEXT, leftIndent=13, firstLineIndent=-8, bulletIndent=0, spaceAfter=2))
styles.add(ParagraphStyle(name="Small", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.2, leading=11.5, textColor=MUTED))
styles.add(ParagraphStyle(name="Card", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=12, leading=16, textColor=WHITE, alignment=TA_CENTER))

def p(text, style="Body"):
    return Paragraph(text, styles[style])

def bullets(items):
    return [Paragraph(item, styles["BulletItem"], bulletText="-") for item in items]

def feature_table(rows):
    data = [[p("Area", "Small"), p("Features to add", "Small"), p("Priority", "Small")]]
    for area, feature, priority in rows:
        data.append([p(area, "Body"), p(feature, "Body"), p(priority, "Body")])
    table = Table(data, colWidths=[1.25 * inch, 4.35 * inch, 0.85 * inch], repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return table

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(doc.leftMargin, 0.48 * inch, A4[0] - doc.rightMargin, 0.48 * inch)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 0.3 * inch, "CampusSphere - Feature Roadmap")
    canvas.drawRightString(A4[0] - doc.rightMargin, 0.3 * inch, f"Page {doc.page}")
    canvas.restoreState()

story = []

# Cover
story += [Spacer(1, 1.15 * inch), p("CampusSphere", "CoverTitle"), p("Feature Roadmap and Product Expansion Plan", "CoverSub"), Spacer(1, 0.32 * inch)]
cover_cards = Table([[p("AI-powered learning", "Card"), p("Connected campus", "Card"), p("Secure administration", "Card")]], colWidths=[2.1 * inch] * 3)
cover_cards.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (0, 0), INDIGO),
    ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#0891B2")),
    ("BACKGROUND", (2, 0), (2, 0), colors.HexColor("#B45309")),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 22),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 22),
]))
story += [cover_cards, Spacer(1, 0.55 * inch), p("Purpose", "Section"), p("This roadmap lists the major features that can turn the current CampusSphere portal into a complete campus ERP, digital learning platform, and communication hub. The priorities are designed to help build in safe, useful stages.", "CoverSub"), Spacer(1, 0.45 * inch), p("Prepared for the next development phase", "CoverSub"), PageBreak()]

# Page 2 foundation
story += [p("1. Foundation and Core Campus ERP", "Section"), p("Build these first so every later module has reliable data, permissions, and communication.")]
story.append(feature_table([
    ("Authentication", "Forgot password, email verification, reset password, session management, profile photo, password change, optional two-factor login.", "P0"),
    ("Roles", "Complete permissions for Super Admin, Admin, Principal, HOD, Faculty, Student, Placement Officer, Parent and Support Staff.", "P0"),
    ("College setup", "College profile, campuses, departments, programs, batches, semesters, sections, academic calendar and holidays.", "P0"),
    ("Student records", "Admission profile, documents, guardian details, roll number, enrollment status, fee category and student ID card.", "P0"),
    ("Faculty records", "Employee profile, designation, department, workload, qualification, joining date and faculty ID card.", "P0"),
    ("Notifications", "In-app alerts, email alerts, read/unread status, priority notices and scheduled announcements.", "P0"),
    ("Audit and safety", "Admin audit trail, password-policy rules, login history, soft delete, backup plan and activity monitoring.", "P0"),
]))
story += [Spacer(1, 12), p("Recommended data rule", "Subsection"), p("Use one source of truth for users, departments, courses, subjects, enrollments and academic terms. Every module - attendance, marks, chat, meetings and reports - should use these shared records.")]
story += [PageBreak()]

# Page 3 learning and AI
story += [p("2. Learning, Assessment and AI", "Section"), p("Features that make the platform valuable every day for students and faculty.")]
story.append(feature_table([
    ("Course learning", "Course catalogue, lesson modules, syllabus tracker, prerequisites, enrollment, progress bars and completion certificates.", "P1"),
    ("Study material", "Folders by course and subject, video/PDF uploads, preview, search, bookmarks, download control and version history.", "P1"),
    ("Attendance", "QR/manual attendance, timetable integration, late entry rule, absence alerts, subject-wise percentage and shortage notices.", "P1"),
    ("Exams", "Question bank, online quizzes, timed tests, assignments, rubrics, answer upload, plagiarism check and result publishing.", "P1"),
    ("Performance", "Marks dashboard, GPA/CGPA, subject analytics, weak-topic alerts, faculty feedback and improvement plans.", "P1"),
    ("AI chatbot", "CampusSphere AI Assistant for FAQs, navigation help, syllabus/material Q&A, deadline reminders and role-aware answers.", "P1"),
    ("AI study coach", "Personal study plan, quiz generation, flashcards, topic summaries, doubt explanation, revision schedule and progress nudges.", "P2"),
    ("AI faculty tools", "Draft announcements, generate question papers, create lesson plans, summarize submissions and identify at-risk students.", "P2"),
]))
story += [Spacer(1, 10), p("AI guardrails", "Subsection")] + bullets([
    "Keep chatbot answers role-aware: students must never see private faculty/admin data.",
    "Show source links for policies, notices and study material answers.",
    "Store AI conversation history with consent, reporting and delete controls.",
    "Use moderation and clear wording: AI suggestions are guidance, not official academic decisions.",
]) + [PageBreak()]

# Page 4 collaboration
story += [p("3. Collaboration and Video Conferencing", "Section"), p("Make CampusSphere the shared workspace for classes, mentoring and administration.")]
story.append(feature_table([
    ("Messaging", "One-to-one chat, course/section groups, faculty announcements, file sharing, message search, mentions and mute controls.", "P1"),
    ("Discussion forums", "Subject-wise questions, answers, voting, moderation, tags, accepted answers and peer learning spaces.", "P1"),
    ("Appointments", "Student-faculty booking slots, office hours, approval workflow, calendar sync and reminder notifications.", "P1"),
    ("Video meetings", "Create/join meetings, waiting room, host controls, mic/camera controls, screen sharing, participant list and meeting chat.", "P2"),
    ("Live classes", "Class scheduling, attendance from meeting, recording links, whiteboard, polls, raised hand, breakout rooms and captions.", "P2"),
    ("Recording library", "Secure recordings by subject, permission-based playback, notes, timestamps, transcript and retention rules.", "P2"),
    ("Mentoring", "Mentor matching, goals, meeting history, action items, feedback and escalation to HOD/counsellor.", "P2"),
]))
story += [Spacer(1, 10), p("Video implementation choice", "Subsection"), p("For a fast first version, integrate Jitsi Meet or Zoom/Google Meet links with scheduling and attendance. For an advanced in-app experience, use WebRTC with a managed provider such as Daily, Agora or Twilio. Start with secure meeting links, host controls and recordings before building complex live-class tools.")]
story += [PageBreak()]

# Page 5 operations
story += [p("4. Operations, Engagement and Integrations", "Section")]
story.append(feature_table([
    ("Fees", "Fee structure, invoices, online payment gateway, dues reminders, receipts, scholarships and finance reports.", "P2"),
    ("Library", "Book catalogue, issue/return, due dates, fines, e-books, seat booking and library analytics.", "P2"),
    ("Placement", "Company drives, job posts, eligibility rules, resume bank, application tracking, interview schedule and offer analytics.", "P2"),
    ("Grievance", "Confidential complaint tickets, category routing, SLA, status tracking, evidence upload and resolution reports.", "P2"),
    ("Events", "College events, registrations, QR check-in, certificates, clubs, volunteer roles and photo gallery.", "P2"),
    ("Parent portal", "Attendance, results, notices, fees, meeting booking and controlled communication with faculty.", "P3"),
    ("Mobile app", "Android/iOS companion app, push notifications, QR attendance, offline downloads and quick chat access.", "P3"),
    ("Integrations", "Google/Microsoft calendar, payment gateway, email/SMS/WhatsApp, LMS import/export, biometric device and SSO.", "P3"),
]))
story += [Spacer(1, 10), p("Reports dashboard", "Subsection")] + bullets([
    "Admin: enrollment, attendance, fees, materials, user activity and campus-wide alerts.",
    "HOD: department performance, faculty workload, subject performance and pending approvals.",
    "Faculty: student progress, attendance shortages, assignment status and class engagement.",
    "Student: timetable, progress, deadlines, attendance, results and recommended next actions.",
]) + [PageBreak()]

# Page 6 delivery plan
story += [p("5. Recommended Development Sequence", "Section"), p("Do not build everything at once. Deliver useful modules in small, testable releases.")]
phase_data = [
    [p("Phase", "Small"), p("Goal", "Small"), p("Main deliverables", "Small")],
    [p("Phase 1", "Body"), p("Stabilize core", "Body"), p("Roles, permissions, profile fixes, notifications, academic setup, stronger user/admin management.", "Body")],
    [p("Phase 2", "Body"), p("Daily academics", "Body"), p("Timetable, attendance, materials, assessments, results and student/faculty dashboards.", "Body")],
    [p("Phase 3", "Body"), p("AI learning", "Body"), p("CampusSphere AI chatbot, content search, study plans, quizzes and faculty productivity tools.", "Body")],
    [p("Phase 4", "Body"), p("Collaboration", "Body"), p("Messaging, appointments, video meetings, live classes, recordings and mentoring.", "Body")],
    [p("Phase 5", "Body"), p("Full ERP", "Body"), p("Fees, library, placement, grievance, parent portal, mobile app and external integrations.", "Body")],
]
phase_table = Table(phase_data, colWidths=[1.0 * inch, 1.35 * inch, 4.1 * inch], repeatRows=1)
phase_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
    ("GRID", (0, 0), (-1, -1), 0.35, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
story += [phase_table, Spacer(1, 18), p("Success checklist", "Subsection")] + bullets([
    "Every feature has a clear role permission, mobile-friendly screen and empty/error state.",
    "Every sensitive action has confirmation, audit log and secure backend enforcement.",
    "Use real student/faculty feedback after each phase before building the next one.",
    "Add automated tests, database backups, environment-based configuration and deployment monitoring before production launch.",
])

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=0.65 * inch, rightMargin=0.65 * inch, topMargin=0.62 * inch, bottomMargin=0.68 * inch, title="CampusSphere Feature Roadmap")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
