# Demo Mode & Local Data Layer

## Purpose
EduIQ features a zero-configuration Local Demo Mode designed to let hackathon judges, educators, and developers evaluate the application without setting up cloud databases or environment keys.

---

## Pre-Configured Demo Accounts

| Role | Name | Email | Default View |
| :--- | :--- | :--- | :--- |
| **Student** | Maya Whitfield | `maya@eduiq.edu` | `/student/dashboard` |
| **Teacher** | Dr. Elena Marsh | `elena@eduiq.edu` | `/teacher/dashboard` |
| **Administrator** | System Admin | `admin@eduiq.edu` | `/admin/dashboard` |

---

## Local State Persistence
- **Demo Session**: Saved under key `eduiq_demo_session`.
- **Onboarding Completed**: Saved under key `eduiq_onboarding_completed`.
- **Teacher Profile & Avatar**: Saved under key `eduiq_teacher_profile`.
- **Student Profile**: Saved under key `eduiq_student_profile`.

---

## Zero Developer Error Policy
Under no circumstances will EduIQ display database connection errors, cloud credential warnings, or environment variable configuration messages to end users. Technical details belong strictly in internal developer console logs.
