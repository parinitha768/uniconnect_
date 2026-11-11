// UniConnect - Storage & State Management Layer
// Handles LocalStorage persistence, CRUD operations, and session state

const UniStorage = (() => {
  const STORAGE_KEY = 'uniconnect_portal_data_v1';
  const SESSION_KEY = 'uniconnect_portal_session_v1';

  // Deep clone helper
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getSeedData() {
    if (typeof window !== 'undefined' && window.UniConnectSeed) {
      return window.UniConnectSeed;
    }
    if (typeof UniConnectSeed !== 'undefined') {
      return UniConnectSeed;
    }
    return null;
  }

  // Initialize data if not already present
  function init() {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        resetToDefaults();
      }
    } catch (e) {
      console.error('LocalStorage initialization error:', e);
    }
  }

  // Reset to seed data
  function resetToDefaults() {
    const seed = getSeedData();
    if (seed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    }
  }

  // Retrieve full database
  function getData() {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      if (!dataStr) {
        resetToDefaults();
        return clone(getSeedData());
      }
      return JSON.parse(dataStr);
    } catch (e) {
      console.error('Error reading localStorage:', e);
      return clone(getSeedData());
    }
  }

  // Save full database
  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return false;
    }
  }

  // Session / Authentication helpers
  function getCurrentUser() {
    try {
      const sessStr = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      if (sessStr) {
        return JSON.parse(sessStr);
      }
    } catch (e) {
      console.error('Error reading session:', e);
    }
    return null;
  }

  function setCurrentUser(user, remember = true) {
    const userStr = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(SESSION_KEY, userStr);
    } else {
      sessionStorage.setItem(SESSION_KEY, userStr);
    }
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }

  // Authenticate user
  function login(email, password, role) {
    const data = getData();
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = data.users.find(u => 
      u.email.toLowerCase() === cleanEmail && 
      u.password === password &&
      (!role || u.role === role)
    );
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials or role mismatch. Please verify your email, password, and chosen role.' };
  }

  // Students
  function getStudents() {
    return getData().students || [];
  }

  function getStudentById(id) {
    const students = getStudents();
    return students.find(s => s.id === id || s.rollNo === id) || null;
  }

  function addStudent(studentData) {
    const data = getData();
    const id = studentData.id || `STU-2024-${String(data.students.length + 1).padStart(3, '0')}`;
    const newStudent = {
      ...studentData,
      id,
      status: studentData.status || 'Active',
      enrolledCourses: studentData.enrolledCourses || ['CS601', 'CS604'],
      attendanceOverall: studentData.attendanceOverall || 80.0,
      cgpa: studentData.cgpa || 8.0,
      creditsEarned: studentData.creditsEarned || 100
    };
    data.students.push(newStudent);

    // Initialize blank attendance records for new student
    if (!data.studentAttendance[id]) {
      data.studentAttendance[id] = [
        { courseCode: 'CS601', courseTitle: 'Web Engineering', totalHours: 42, attendedHours: 35, percentage: 83.3, status: 'Good' },
        { courseCode: 'CS604', courseTitle: 'Advanced Database Systems', totalHours: 40, attendedHours: 32, percentage: 80.0, status: 'Good' }
      ];
    }

    // Initialize fees
    if (!data.fees[id]) {
      data.fees[id] = {
        studentId: id,
        studentName: newStudent.name,
        totalPayable: 73500,
        totalPaid: 73500,
        totalPending: 0,
        breakdown: [
          {
            id: 'FEE-NEW-01',
            feeType: 'Tuition Fee - Semester VI',
            dueDate: '2026-08-31',
            amount: 65000,
            paidAmount: 65000,
            status: 'Paid',
            paymentDate: '2026-08-15',
            receiptNo: 'REC-2026-AUTO',
            mode: 'Net Banking'
          },
          {
            id: 'FEE-NEW-02',
            feeType: 'Examination & Evaluation Fee',
            dueDate: '2026-09-10',
            amount: 8500,
            paidAmount: 8500,
            status: 'Paid',
            paymentDate: '2026-09-02',
            receiptNo: 'REC-2026-AUTO2',
            mode: 'Debit Card'
          }
        ],
        paymentHistory: []
      };
    }

    saveData(data);
    return newStudent;
  }

  function updateStudent(id, updatedFields) {
    const data = getData();
    const idx = data.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      data.students[idx] = { ...data.students[idx], ...updatedFields };
      saveData(data);
      return data.students[idx];
    }
    return null;
  }

  function deleteStudent(id) {
    const data = getData();
    data.students = data.students.filter(s => s.id !== id);
    saveData(data);
    return true;
  }

  // Faculty
  function getFacultyList() {
    return getData().faculty || [];
  }

  function getFacultyById(id) {
    const list = getFacultyList();
    return list.find(f => f.id === id) || null;
  }

  function addFaculty(facultyData) {
    const data = getData();
    const id = facultyData.id || `FAC-${100 + data.faculty.length + 1}`;
    const newFaculty = {
      ...facultyData,
      id,
      rating: facultyData.rating || 4.5,
      menteesCount: facultyData.menteesCount || 10,
      assignedCourses: facultyData.assignedCourses || []
    };
    data.faculty.push(newFaculty);
    saveData(data);
    return newFaculty;
  }

  function updateFaculty(id, updatedFields) {
    const data = getData();
    const idx = data.faculty.findIndex(f => f.id === id);
    if (idx !== -1) {
      data.faculty[idx] = { ...data.faculty[idx], ...updatedFields };
      saveData(data);
      return data.faculty[idx];
    }
    return null;
  }

  function deleteFaculty(id) {
    const data = getData();
    data.faculty = data.faculty.filter(f => f.id !== id);
    saveData(data);
    return true;
  }

  // Courses
  function getCourses() {
    return getData().courses || [];
  }

  function getCourseByCode(code) {
    const courses = getCourses();
    return courses.find(c => c.code === code) || null;
  }

  function addCourse(courseData) {
    const data = getData();
    data.courses.push(courseData);
    saveData(data);
    return courseData;
  }

  // Course Elective Registration
  function registerCourse(studentId, courseCode) {
    const data = getData();
    const student = data.students.find(s => s.id === studentId);
    const course = data.courses.find(c => c.code === courseCode);

    if (!student || !course) {
      return { success: false, message: 'Student or course not found.' };
    }

    if (student.enrolledCourses.includes(courseCode)) {
      return { success: false, message: 'Already enrolled in this course.' };
    }

    if (course.enrolledCount >= course.maxCapacity) {
      return { success: false, message: 'Course is currently full (Capacity reached).' };
    }

    // Credit calculation check (Max 24 credits)
    const currentCredits = student.enrolledCourses.reduce((sum, code) => {
      const c = data.courses.find(item => item.code === code);
      return sum + (c ? c.credits : 0);
    }, 0);

    if (currentCredits + course.credits > 24) {
      return { 
        success: false, 
        message: `Credit limit exceeded! Current: ${currentCredits} cr, Course requires: ${course.credits} cr. Maximum semester cap is 24 credits.` 
      };
    }

    // Add course
    student.enrolledCourses.push(courseCode);
    student.currentSemesterCredits = currentCredits + course.credits;
    course.enrolledCount = (course.enrolledCount || 0) + 1;

    // Add entry in student attendance
    if (!data.studentAttendance[studentId]) {
      data.studentAttendance[studentId] = [];
    }
    const existingAtt = data.studentAttendance[studentId].find(a => a.courseCode === courseCode);
    if (!existingAtt) {
      data.studentAttendance[studentId].push({
        courseCode: course.code,
        courseTitle: course.title,
        totalHours: 1,
        attendedHours: 1,
        percentage: 100.0,
        status: 'Good'
      });
    }

    saveData(data);
    return { success: true, message: `Successfully registered for ${course.code} - ${course.title} (${course.credits} Credits).` };
  }

  function dropCourse(studentId, courseCode) {
    const data = getData();
    const student = data.students.find(s => s.id === studentId);
    const course = data.courses.find(c => c.code === courseCode);

    if (!student || !course) {
      return { success: false, message: 'Student or course not found.' };
    }

    if (course.type === 'Core') {
      return { success: false, message: 'Cannot drop a mandatory Core academic course.' };
    }

    if (!student.enrolledCourses.includes(courseCode)) {
      return { success: false, message: 'Course not in enrolled list.' };
    }

    student.enrolledCourses = student.enrolledCourses.filter(c => c !== courseCode);
    student.currentSemesterCredits = Math.max(0, (student.currentSemesterCredits || 0) - course.credits);
    course.enrolledCount = Math.max(0, (course.enrolledCount || 0) - 1);

    if (data.studentAttendance[studentId]) {
      data.studentAttendance[studentId] = data.studentAttendance[studentId].filter(a => a.courseCode !== courseCode);
    }

    saveData(data);
    return { success: true, message: `Successfully dropped elective ${course.code}.` };
  }

  // Attendance
  function getStudentAttendance(studentId) {
    const data = getData();
    return data.studentAttendance[studentId] || [];
  }

  function saveFacultyAttendance(courseCode, date, topic, attendanceRecordMap, facultyId) {
    const data = getData();
    const sessionId = `ATT-${date.replace(/-/g, '')}-${courseCode}`;

    // Update or insert session log
    const existingIndex = data.attendanceSessions.findIndex(s => s.courseCode === courseCode && s.date === date);
    const sessionObj = {
      id: sessionId,
      courseCode,
      date,
      topic: topic || 'Regular Lecture',
      facultyId,
      records: attendanceRecordMap
    };

    if (existingIndex >= 0) {
      data.attendanceSessions[existingIndex] = sessionObj;
    } else {
      data.attendanceSessions.unshift(sessionObj);
    }

    // Update cumulative student attendance records
    for (const [studentId, status] of Object.entries(attendanceRecordMap)) {
      if (!data.studentAttendance[studentId]) {
        data.studentAttendance[studentId] = [];
      }
      let subjectAtt = data.studentAttendance[studentId].find(a => a.courseCode === courseCode);
      const course = data.courses.find(c => c.code === courseCode);

      if (!subjectAtt) {
        subjectAtt = {
          courseCode,
          courseTitle: course ? course.title : courseCode,
          totalHours: 0,
          attendedHours: 0,
          percentage: 0,
          status: 'Good'
        };
        data.studentAttendance[studentId].push(subjectAtt);
      }

      // Increment hours
      subjectAtt.totalHours += 1;
      if (status === 'Present') {
        subjectAtt.attendedHours += 1;
      }

      subjectAtt.percentage = parseFloat(((subjectAtt.attendedHours / subjectAtt.totalHours) * 100).toFixed(1));
      subjectAtt.status = subjectAtt.percentage >= 75 ? 'Good' : (subjectAtt.percentage >= 65 ? 'Warning' : 'Critical');

      // Update student overall attendance
      const allAtts = data.studentAttendance[studentId];
      const totalAll = allAtts.reduce((sum, a) => sum + a.totalHours, 0);
      const attendedAll = allAtts.reduce((sum, a) => sum + a.attendedHours, 0);
      const studentObj = data.students.find(s => s.id === studentId);
      if (studentObj && totalAll > 0) {
        studentObj.attendanceOverall = parseFloat(((attendedAll / totalAll) * 100).toFixed(1));
      }
    }

    saveData(data);
    return { success: true, message: `Attendance saved successfully for ${courseCode} on ${date}.` };
  }

  // Marks & Exams
  function getExamSchedules() {
    return getData().examSchedules || [];
  }

  function getStudentResults(studentId) {
    const data = getData();
    return data.studentResults[studentId] || null;
  }

  function getFacultyMarks(courseCode) {
    const data = getData();
    return data.facultyMarksLedger[courseCode] || [];
  }

  function saveFacultyMarks(courseCode, marksList) {
    const data = getData();
    data.facultyMarksLedger[courseCode] = marksList;

    // Update internal assessment marks for relevant students
    marksList.forEach(item => {
      if (data.studentResults[item.studentId] && data.studentResults[item.studentId].currentSemesterInternal) {
        const studentRecord = data.studentResults[item.studentId].currentSemesterInternal.find(r => r.courseCode === courseCode);
        if (studentRecord) {
          studentRecord.internal1 = Number(item.test1) || 0;
          studentRecord.internal2 = Number(item.test2) || 0;
          studentRecord.assignment = Number(item.assignment) || 0;
          studentRecord.totalInternal = studentRecord.internal1 + studentRecord.internal2 + studentRecord.assignment;
          studentRecord.status = studentRecord.totalInternal >= 50 ? 'On Track' : 'Needs Improvement';
        }
      }
    });

    saveData(data);
    return { success: true, message: `Evaluation marks published successfully for ${courseCode}.` };
  }

  // Fees & Payments
  function getStudentFees(studentId) {
    const data = getData();
    return data.fees[studentId] || null;
  }

  function payFeeItem(studentId, feeItemId, paymentMode) {
    const data = getData();
    const studentFee = data.fees[studentId];
    if (!studentFee) return { success: false, message: 'Fee record not found.' };

    const item = studentFee.breakdown.find(f => f.id === feeItemId);
    if (!item) return { success: false, message: 'Fee item not found.' };

    if (item.status === 'Paid') {
      return { success: false, message: 'This fee item has already been cleared.' };
    }

    const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const txnId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const today = new Date().toISOString().split('T')[0];

    const payableAmount = item.amount - (item.paidAmount || 0);

    item.paidAmount = item.amount;
    item.status = 'Paid';
    item.paymentDate = today;
    item.receiptNo = receiptNo;
    item.mode = paymentMode || 'UPI / Online';

    studentFee.totalPaid += payableAmount;
    studentFee.totalPending = Math.max(0, studentFee.totalPending - payableAmount);

    if (!studentFee.paymentHistory) studentFee.paymentHistory = [];
    studentFee.paymentHistory.unshift({
      receiptNo,
      date: today,
      description: item.feeType,
      amount: payableAmount,
      status: 'Success',
      paymentMode: `${paymentMode} (Ref: ${receiptNo})`,
      transactionId: txnId
    });

    saveData(data);
    return {
      success: true,
      message: `Payment of ₹${payableAmount.toLocaleString()} successful! Receipt generated.`,
      receipt: {
        receiptNo,
        transactionId: txnId,
        date: today,
        studentName: studentFee.studentName,
        studentId,
        description: item.feeType,
        amount: payableAmount,
        paymentMode
      }
    };
  }

  // Grievances
  function getGrievances(studentId = null) {
    const data = getData();
    const list = data.grievances || [];
    if (studentId) {
      return list.filter(g => g.studentId === studentId);
    }
    return list;
  }

  function createGrievance(grievanceData) {
    const data = getData();
    const id = `GRV-2026-${100 + (data.grievances ? data.grievances.length + 1 : 1)}`;
    const now = new Date();
    const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newGrievance = {
      id,
      studentId: grievanceData.studentId,
      studentName: grievanceData.studentName,
      department: grievanceData.department || 'CSE',
      category: grievanceData.category,
      title: grievanceData.title,
      description: grievanceData.description,
      submittedDate: dateFormatted,
      priority: grievanceData.priority || 'Medium',
      status: 'Pending',
      adminNote: '',
      resolvedDate: null,
      resolvedBy: null
    };

    if (!data.grievances) data.grievances = [];
    data.grievances.unshift(newGrievance);
    saveData(data);
    return { success: true, message: `Grievance ticket #${id} submitted successfully.`, grievance: newGrievance };
  }

  function updateGrievance(id, status, adminNote, resolvedBy) {
    const data = getData();
    const g = data.grievances.find(item => item.id === id);
    if (!g) return { success: false, message: 'Grievance ticket not found.' };

    g.status = status;
    if (adminNote) g.adminNote = adminNote;
    if (status === 'Resolved') {
      const now = new Date();
      g.resolvedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      g.resolvedBy = resolvedBy || 'Administrator';
    }

    saveData(data);
    return { success: true, message: `Grievance #${id} updated to ${status}.` };
  }

  // Announcements
  function getAnnouncements() {
    return getData().announcements || [];
  }

  function addAnnouncement(announcement) {
    const data = getData();
    const id = `ANN-${100 + (data.announcements ? data.announcements.length + 1 : 1)}`;
    const today = new Date().toISOString().split('T')[0];

    const newAnn = {
      id,
      title: announcement.title,
      category: announcement.category || 'General',
      author: announcement.author || 'University Administration',
      date: today,
      urgent: Boolean(announcement.urgent),
      audience: announcement.audience || 'All Students & Faculty',
      content: announcement.content,
      icon: announcement.icon || 'bell'
    };

    if (!data.announcements) data.announcements = [];
    data.announcements.unshift(newAnn);
    saveData(data);
    return { success: true, message: 'Announcement published successfully!', announcement: newAnn };
  }

  // Initialize immediately
  init();

  return {
    getData,
    saveData,
    resetToDefaults,
    getCurrentUser,
    setCurrentUser,
    clearSession,
    login,
    getStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
    getFacultyList,
    getFacultyById,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    getCourses,
    getCourseByCode,
    addCourse,
    registerCourse,
    dropCourse,
    getStudentAttendance,
    saveFacultyAttendance,
    getExamSchedules,
    getStudentResults,
    getFacultyMarks,
    saveFacultyMarks,
    getStudentFees,
    payFeeItem,
    getGrievances,
    createGrievance,
    updateGrievance,
    getAnnouncements,
    addAnnouncement
  };
})();

// Export to window
if (typeof window !== 'undefined') {
  window.UniStorage = UniStorage;
}

