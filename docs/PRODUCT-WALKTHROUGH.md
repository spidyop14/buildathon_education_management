# Interactive In-App Product Walkthrough Specification

## Overview
EduIQ implements an interactive in-app guided product walkthrough (`src/components/onboarding/InteractiveProductTour.tsx`) that anchors directly to DOM elements using `data-tour` attributes.

---

## Structure of Each Step (WHAT / DO / WHY Pattern)

Every step in the walkthrough answers three core questions:
1. **WHAT IS THIS?**: Clear definition of the highlighted section.
2. **WHAT CAN I DO HERE?**: Concrete user actions available in this view.
3. **WHY DOES IT MATTER?**: Explanation of how it contributes to EduIQ's academic intelligence framework.

---

## Role-Specific Walkthrough Sequences

### 🎓 Student Walkthrough (10 Steps)
1. **Dashboard** (`[data-tour="dashboard"]`): Composite score index, attendance ring, and recent activity.
2. **My Schedule** (`[data-tour="schedule"]`): Timeline calendar of classes, assignments, and exam deadlines.
3. **Courses** (`[data-tour="courses"]`): Enrolled subjects, course syllabi, and faculty information.
4. **Assignments** (`[data-tour="assignments"]`): Task deadlines, online submission workspace, and grade feedback.
5. **Attendance** (`[data-tour="attendance"]`): Attendance log, percentage ring, and 75% threshold warnings.
6. **Examinations** (`[data-tour="examinations"]`): Interactive assessment hub with full-screen MCQ exam mode.
7. **Study Planner** (`[data-tour="planner"]`): Actionable revision task scheduler prioritizing weak subjects.
8. **Progress** (`[data-tour="progress"]`): Visual analytics trajectories and weak subject warnings.
9. **Academic Intelligence** (`[data-tour="ai-insights"]`): Explainable AI rules engine connecting raw data to recommendations.
10. **Profile** (`[data-tour="profile"]`): Student identity, metadata, and settings.

---

### 👩‍🏫 Teacher Walkthrough (10 Steps)
1. **Dashboard**: Educator control center and daily task queue.
2. **Assigned Courses**: Teaching portfolio and curriculum outlines.
3. **Classes**: Class section schedules and student roster drawers.
4. **Assignments**: Coursework creation and deadline scheduling.
5. **Submissions**: Split-view grading interface with **AI Grading Assistant** (`[Accept AI Score]`).
6. **Examinations**: MCQ Assessment Builder and score breakdown charts.
7. **Attendance**: One-touch attendance logger (`Present`/`Late`/`Absent`/`Mark All Present`).
8. **Students**: Roster intelligence and student standing risk badges.
9. **Academic Insights**: Interactive Academic Pulse node diagram.
10. **Profile**: Faculty identity and office hour preferences.

---

### 🏛️ Administrator Walkthrough (10 Steps)
1. **Dashboard**: Executive institutional health metrics.
2. **Manage Students**: Student roster directory with full CRUD governance.
3. **Manage Teachers**: Faculty directory and course assignment management.
4. **Manage Courses**: Institutional course catalog builder.
5. **Manage Classes**: Class section and room capacity scheduling.
6. **Analytics**: System-wide comparative metrics across departments.
7. **AI Insights**: Institutional anomaly detection and risk summaries.
8. **Examinations**: Assessment cycle governance and score parameters.
9. **Reports**: Official printable academic transcript generator with browser print integration.
10. **Profile**: Executive identity, system credentials, and security oversight settings.
