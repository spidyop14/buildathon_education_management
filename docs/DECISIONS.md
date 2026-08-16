# Architecture Decision Records (ADRs)

## ADR-001: Role-Based Workspace Architecture & Route Separation
- **Context**: EduIQ serves three distinct user roles (Student, Teacher, Administrator), each requiring different data perspectives, layout structures, and action capabilities.
- **Decision**: Implement a unified `AppShell` layout component paired with declarative `RoleGuard` route wrappers (`allowedRole="student" | "teacher" | "admin"`).
- **Rationale**: Ensures strict route security while maximizing reusable navigation, command palette (`⌘K`), and AI drawer infrastructure.

---

## ADR-002: Explainable Deterministic AI Pipeline vs Black-Box Models
- **Context**: Educational platforms require 100% data traceability and explainability for grading and academic risk alerts.
- **Decision**: Implement a deterministic mathematical and rules-based intelligence pipeline (`src/lib/ai/rules.ts`) combined with contextual educator AI drawers.
- **Rationale**: Prevents uncalibrated AI hallucinations, ensures every recommendation is verifiable against real student data, and eliminates external API latency and cost barriers during demo evaluations.

---

## ADR-003: Dual-Mode Auth & Zero-Error Local Demo Architecture
- **Context**: Hackathon judges and offline evaluators must be able to explore the full application without configuring third-party Supabase cloud keys or database instances.
- **Decision**: Implement dual-mode auth in `authService.ts`. If cloud environment variables are missing, automatically fall back to local demo session persistence with pre-configured role profiles.
- **Rationale**: Eliminates scary developer configuration error messages for end users and guarantees 100% demo availability.

---

## ADR-004: Centralized Reactive DataStore with External Sync
- **Context**: State mutations (e.g. grading coursework or marking attendance) must instantly reflect across all mounted views without page reloads or full component trees re-rendering.
- **Decision**: Implement a lightweight reactive state store (`dataStore.ts`) using React 18's `useSyncExternalStore`.
- **Rationale**: Delivers sub-millisecond reactive state updates across Student, Teacher, and Admin views with minimal memory footprint.

---

## ADR-005: In-DOM Interactive Product Walkthrough with Element Spotlighting
- **Context**: Evaluators need to immediately understand section capabilities without reading external user manuals.
- **Decision**: Implement an interactive product tour (`InteractiveProductTour.tsx`) that auto-navigates to pages and anchors spotlight cutouts directly to DOM elements using `data-tour` attributes.
- **Rationale**: Provides a hands-on, self-guided experience using real application UI elements rather than static modal overlays.
