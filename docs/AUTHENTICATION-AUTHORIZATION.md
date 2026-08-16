# Authentication & Authorization Architecture

## 1. Core Distinction

```
┌─────────────────────────────────────────────────────────────┐
│ AUTHENTICATION (Who are you?)                                │
│ Identifies user identity & assigns user role (Student/      │
│ Teacher/Admin) via Cloud Auth or Local Demo Fallback.        │
├─────────────────────────────────────────────────────────────┤
│ AUTHORIZATION (What are you allowed to access?)              │
│ Enforces role permissions at the route level via RoleGuard  │
│ and at the workspace navigation level.                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication Architecture & Dual-Mode Flow

```mermaid
graph TD
    LoginAttempt[User Navigates to /login or /register] --> Choice{Cloud Credentials Available?}
    Choice -- Yes --> SupabaseAuth[Authenticate via Supabase Cloud Auth]
    Choice -- No --> LocalDemoAuth[Authenticate via Local Demo Service]
    SupabaseAuth --> SocialCheck{Google / Microsoft OAuth?}
    SocialCheck -- Yes --> RoleModal[Prompt "How will you use EduIQ?" Role Modal]
    SocialCheck -- No --> SessionInit[Initialize User Session]
    LocalDemoAuth --> RoleModal
    RoleModal --> SessionInit
    SessionInit --> SaveSession[Persist Session in eduiq_demo_session]
    SaveSession --> NavigateRole[Navigate to /:role/dashboard]
```

---

## 3. Authorization & Route Protection (`RoleGuard.tsx`)

Route protection is strictly enforced at the React Router layer:

```tsx
export function RoleGuard({ allowedRole }: { allowedRole: UserRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    // Redirect unauthorized attempts to the user's correct workspace
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
}
```

### Route Access Control Policy Table

| Route Path | Allowed Roles | Access Action on Failure |
| :--- | :--- | :--- |
| `/student/*` | `student` | Redirects to `/login` if unauthenticated, or `/${user.role}/dashboard` if wrong role |
| `/teacher/*` | `teacher` | Redirects to `/login` if unauthenticated, or `/${user.role}/dashboard` if wrong role |
| `/admin/*` | `admin` | Redirects to `/login` if unauthenticated, or `/${user.role}/dashboard` if wrong role |
| `/login`, `/register`, `/courses`, `/contact`, `/` | Public (Unrestricted) | Accessible to all users |
