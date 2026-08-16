# Complete Project & Data Flow Specification

```mermaid
graph TD
    Landing[Public Landing Page /] --> Auth[Login / Register]
    Auth --> RoleModal[Role Selection Intercept Modal]
    RoleModal -->|Student| StudentDash[/student/dashboard]
    RoleModal -->|Teacher| TeacherDash[/teacher/dashboard]
    RoleModal -->|Admin| AdminDash[/admin/dashboard]

    subgraph Student Flow
        StudentDash --> Courses[/student/courses]
        StudentDash --> Assignments[/student/assignments]
        StudentDash --> Exams[/student/examinations]
        StudentDash --> Progress[/student/progress]
        Exams --> TakeExam[/student/examinations/:id]
    end

    subgraph Teacher Flow
        TeacherDash --> SectionAttendance[/teacher/attendance]
        TeacherDash --> Submissions[/teacher/submissions]
        TeacherDash --> MCQBuilder[/teacher/examinations]
        TeacherDash --> AcademicPulse[/teacher/insights]
    end

    subgraph Admin Flow
        AdminDash --> RosterMgmt[/admin/students & /admin/teachers]
        AdminDash --> CatalogMgmt[/admin/courses & /admin/classes]
        AdminDash --> Reports[/admin/reports]
    end
```
