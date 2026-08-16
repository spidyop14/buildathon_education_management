# Core System Pseudocode Specifications

## 1. Student Login & Session Initialization Flow
```
START Student Login
  Input: userEmail, password (or social OAuth payload), selectedRole
  
  IF cloudAuthenticationConfigured THEN
    response = authenticateWithCloud(userEmail, password)
  ELSE
    response = authenticateWithLocalDemo(userEmail, selectedRole)
  ENDIF

  IF response.status == SUCCESS THEN
    IF selectedRole IS NULL THEN
      selectedRole = openRoleSelectionModal()
    ENDIF

    userSession = createSessionObject(response.user, selectedRole)
    persistSessionToLocalStorage("eduiq_demo_session", userSession)
    
    REDIRECT to "/"+selectedRole+"/dashboard"
  ELSE
    displayCleanAuthError("Invalid credentials. Try demo mode.")
  ENDIF
END
```

---

## 2. Classroom Attendance Logging & Signal Recalculation Flow
```
START Record Classroom Attendance
  Input: classSectionId, attendanceRecords // [{ studentId, status: 'present'|'late'|'absent' }]
  
  FOR EACH record IN attendanceRecords DO
    student = findStudentById(record.studentId)
    
    // Append entry to attendance log
    newDay = student.attendanceLog.length + 1
    student.attendanceLog.append({ day: newDay, status: record.status })
    
    // Recalculate attendance percentage
    presentCount = countStatus(student.attendanceLog, 'present')
    lateCount = countStatus(student.attendanceLog, 'late')
    
    student.attendance = Math.round(((presentCount + lateCount * 0.5) / student.attendanceLog.length) * 100)
    
    // Evaluate risk threshold
    IF student.attendance < 75 THEN
      student.riskFlag = "AT_RISK_ATTENDANCE"
    ELSE
      student.riskFlag = "GOOD_STANDING"
    ENDIF
  ENDFOR
  
  publishDataStoreStateUpdate()
  logAdminActivity("ATTENDANCE_UPDATE", "Logged section attendance", teacherName)
END
```

---

## 3. Assignment Submission & AI-Assisted Grading Flow
```
START Create & Grade Assignment
  // Teacher creates assignment
  assignmentId = generateId()
  assignment = { id: assignmentId, courseId, title, dueDate, maxScore, status: 'pending' }
  addAssignmentToDataStore(assignment)

  // Student submits assignment
  studentSubmitAssignment(assignmentId) -> assignment.status = 'submitted'

  // Teacher evaluates submission with AI Assistant
  aiSuggestedScore = computeAISuggestedScore(submissionContent, rubric)
  teacherReview = openSubmissionGradingWorkspace(assignmentId)
  
  IF teacherClicksAcceptAIScore THEN
    finalScore = aiSuggestedScore
  ELSE
    finalScore = teacherInputScore
  ENDIF

  assignment.score = finalScore
  assignment.status = 'graded'
  assignment.feedback = teacherFeedback

  recalculateStudentSubjectAverage(studentId, courseId)
  publishDataStoreStateUpdate()
END
```

---

## 4. AI Academic Intelligence Signal Processing Flow
```
START AI Intelligence Evaluation
  Input: student (subjects, attendance, examHistory)
  insightsList = []

  // Check 1: Weak Subject Detection
  FOR EACH subject IN student.subjects DO
    subjectAvg = (subject.assignmentAvg + subject.examAvg) / 2
    IF subjectAvg < 65 THEN
      insightsList.append({
        id: generateId(),
        severity: 'high',
        category: 'weak_subject',
        title: subject.name + " is a weak subject",
        metric: "Average: " + subjectAvg + "%",
        recommendation: "Focus on fundamentals and schedule 2 revision sessions in Study Planner."
      })
    ENDIF
  ENDFOR

  // Check 2: Declining Trajectory Detection
  FOR EACH subject IN student.subjects DO
    history = subject.examHistory
    IF history.length >= 3 AND history[n-1] < history[n-2] AND history[n-2] < history[n-3] THEN
      insightsList.append({
        id: generateId(),
        severity: 'high',
        category: 'trend',
        title: subject.name + " scores are declining",
        recommendation: "Schedule a teacher check-in before final examinations."
      })
    ENDIF
  ENDFOR

  RETURN insightsList
END
```

---

## 5. Official Academic Report Generation Flow
```
START Generate & Print Official Report
  Input: studentId
  student = findStudentById(studentId)
  
  reportDoc = createReportDocument()
  reportDoc.header = "EduIQ Official Academic Transcript"
  reportDoc.reference = "EIQ-REP-" + studentId + "-2026"
  reportDoc.studentInfo = { name: student.name, id: student.code, cumulativeAvg: calculateCompositeIndex(student) }
  
  reportDoc.subjectGradesTable = generateSubjectGradesTable(student.subjects)
  reportDoc.aiRiskSummary = generateAIRiskSummary(student)
  
  renderReportDocumentUI(reportDoc)
  
  IF userClicksPrint THEN
    triggerBrowserPrintDialog() // window.print()
  ENDIF
END
```
