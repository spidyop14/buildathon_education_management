# Authentication & Access Control

## Overview
EduIQ implements a robust dual-mode authentication framework that ensures seamless operation both in production environments and in local offline demo modes.

---

## 1. Dual-Mode Authentication Logic

```mermaid
graph TD
    LoginAttempt[User Clicks Login / Register] --> CheckCloud{Is Cloud Auth Configured?}
    CheckCloud -- Yes --> CloudAuth[Authenticate with Cloud / Supabase Provider]
    CheckCloud -- No --> DemoAuth[Local Demo Authentication Fallback]
    CloudAuth --> RoleSelect[Show "How will you use EduIQ?" Role Modal]
    DemoAuth --> RoleSelect
    RoleSelect --> CreateSession[Initialize Session & User Context]
    CreateSession --> Redirect[Redirect to /role/dashboard]
```

---

## 2. OAuth & Role Selection Flow
When a user authenticates via Google or Microsoft social login:
1. **Authentication Phase**: Validates user identity.
2. **Role Selection Intercept**: Intercepts redirection to prompt the unified modal:
   - **Student**: Full learning portfolio & performance view.
   - **Teacher**: Educator control center & AI grading assistant.
   - **Administrator**: Institutional governance & official printable reports.
3. **Session Persistence**: Saves selected role into local session state (`eduiq_demo_session`).

---

## 3. Route Guard & Authorization (`RoleGuard.tsx`)
Protected routes strictly verify role permissions:
- `/student/*` $\longrightarrow$ Requires `user.role === 'student'`
- `/teacher/*` $\longrightarrow$ Requires `user.role === 'teacher'`
- `/admin/*` $\longrightarrow$ Requires `user.role === 'admin'`

Unauthorized route attempts automatically trigger redirection to the user's appropriate role dashboard.
