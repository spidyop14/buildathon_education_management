# AI Academic Intelligence Documentation

## Purpose
EduIQ's AI Academic Intelligence Engine analyzes raw academic signals — attendance percentages, assignment coursework scores, exam marks, and grade histories — to generate transparent, explainable insights and actionable study tips.

> **Implementation Disclosure**: EduIQ utilizes an **explainable deterministic rules engine** (`src/lib/ai/rules.ts`) combined with contextual AI drawers. It does not rely on opaque black-box machine learning predictions, ensuring that every recommendation is directly traceable to real student performance data.

---

## Inputs & Data Attributes Analyzed

1. **Attendance Rate ($A$)**: Computed from session attendance logs ($Present = 1.0, Late = 0.5, Absent = 0.0$).
2. **Assignment Average ($S_{assig}$)**: Mean percentage score across submitted coursework.
3. **Exam Average ($S_{exam}$)**: Mean percentage score across completed examinations.
4. **Subject Trajectory ($T_{subj}$)**: Sequential historical exam score array ($e_1, e_2, e_3, \dots, e_n$).
5. **Composite Performance Index ($P$)**: Weighted calculation:
   $$P = (0.6 \times S_{academic}) + (0.4 \times A)$$

---

## Analysis & Detection Rules

### Rule 1: Weak Subject Identification
- **Condition**: Subject composite average is less than `65%` OR lower than all other enrolled subjects by $> 15\%$.
- **Signal**: `severity: 'high'`, `category: 'weak_subject'`.
- **Output**: Identifies subject name, current score, and specifies the exact gap.

### Rule 2: Attendance Risk Threshold Alert
- **Condition**: Overall attendance rate $A < 75\%$.
- **Signal**: `severity: 'moderate'` or `'high'`, `category: 'attendance'`.
- **Output**: Highlights total missed sessions and calculates required attended sessions to restore health.

### Rule 3: Declining Performance Trajectory
- **Condition**: Historical exam scores show $e_{n-2} > e_{n-1} > e_n$ over 3 consecutive assessments.
- **Signal**: `severity: 'high'`, `category: 'trend'`.
- **Output**: Issues an early intervention warning to both student and educator before final exams.

### Rule 4: Improving Performance Recognition
- **Condition**: Historical scores show consistent upward trend ($e_{n} > e_{n-1}$).
- **Signal**: `severity: 'positive'`, `category: 'improving'`.
- **Output**: Recommends maintaining current study habits and advancing to enrichment coursework.

---

## AI Recommendation Generation Pipeline

```
[Attendance Log + Coursework Scores + Exam Marks]
                      │
                      ▼
        [Deterministic Rules Engine]
                      │
    ┌─────────────────┴─────────────────┐
    ▼                                   ▼
[Student Insight Cards]         [Teacher / Admin Risk Alerts]
  - Weak Subject Warning          - At-Risk Student Badges
  - Study Session Advice          - AI Grading Assistant Suggestions
```
