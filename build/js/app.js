// =========================================================
// UniConnect - Main Application Controller
// Handles UI routing, role switching, user interactions, modals & rendering
// =========================================================

const UniApp = (() => {
  // Application State
  let currentUser = null;
  let currentRole = 'student';
  let currentView = 'student-dashboard';

  // Initialize App on DOM Ready
  function init() {
    // Check if user session already exists
    currentUser = UniStorage.getCurrentUser();
    if (currentUser) {
      currentRole = currentUser.role;
      showAppShell();
    } else {
      showLoginScreen();
    }

    setupLoginRoleListeners();
  }

  // =========================================================
  // AUTHENTICATION & SESSION MANAGEMENT
  // =========================================================

  function setupLoginRoleListeners() {
    const rolePills = document.querySelectorAll('#login-role-selector .role-pill');
    rolePills.forEach(pill => {
      pill.addEventListener('click', () => {
        rolePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const role = pill.getAttribute('data-role');
        fillDemoLogin(role, false);
      });
    });
  }

  function fillDemoLogin(role, autoSubmit = false) {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const rolePills = document.querySelectorAll('#login-role-selector .role-pill');
    
    // Highlight pill
    rolePills.forEach(p => {
      if (p.getAttribute('data-role') === role) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    const credentials = {
      student: { email: 'student@uniconnect.edu', pass: 'student123' },
      faculty: { email: 'faculty@uniconnect.edu', pass: 'faculty123' },
      parent: { email: 'parent@uniconnect.edu', pass: 'parent123' },
      admin: { email: 'admin@uniconnect.edu', pass: 'admin123' }
    };

    if (credentials[role]) {
      emailInput.value = credentials[role].email;
      passInput.value = credentials[role].pass;
      hideLoginError();

      if (autoSubmit) {
        const fakeEvent = { preventDefault: () => {} };
        handleLoginSubmit(fakeEvent);
      }
    }
  }

  function togglePasswordVisibility() {
    const passInput = document.getElementById('login-password');
    if (passInput.type === 'password') {
      passInput.type = 'text';
    } else {
      passInput.type = 'password';
    }
  }

  function handleLoginSubmit(event) {
    if (event) event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const activePill = document.querySelector('#login-role-selector .role-pill.active');
    const selectedRole = activePill ? activePill.getAttribute('data-role') : null;

    const res = UniStorage.login(email, password, selectedRole);
    if (res.success) {
      currentUser = res.user;
      currentRole = res.user.role;
      showToast(`Welcome back, ${currentUser.name}!`, 'success');
      showAppShell();
    } else {
      showLoginError(res.message);
    }
  }

  function showLoginError(msg) {
    const el = document.getElementById('login-error-msg');
    el.innerText = msg;
    el.style.display = 'block';
  }

  function hideLoginError() {
    const el = document.getElementById('login-error-msg');
    el.style.display = 'none';
  }

  function logout() {
    UniStorage.clearSession();
    currentUser = null;
    showToast('You have been logged out successfully.', 'info');
    showLoginScreen();
  }

  function switchRole(newRole) {
    // Quickly switch session user to corresponding role's demo user
    const data = UniStorage.getData();
    const targetUser = data.users.find(u => u.role === newRole);
    if (targetUser) {
      currentUser = targetUser;
      currentRole = newRole;
      UniStorage.setCurrentUser(targetUser);
      showToast(`Switched view to ${newRole.toUpperCase()} mode.`, 'info');
      showAppShell();
    }
  }

  function resetDemoData() {
    if (confirm('Are you sure you want to reset all portal demo data back to default? Any added entries or marked attendance will be restored to initial state.')) {
      UniStorage.resetToDefaults();
      showToast('Demo data reset to default successfully!', 'success');
      showAppShell();
    }
  }

  // =========================================================
  // VIEW & SHELL MANAGEMENT
  // =========================================================

  function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('app-shell').style.display = 'none';
  }

  function showAppShell() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-shell').style.display = 'flex';

    // Update topbar quick switcher value
    const switcher = document.getElementById('quick-role-switcher');
    if (switcher) switcher.value = currentRole;

    // Update sidebar user profile card
    document.getElementById('sidebar-user-name').innerText = currentUser.name;
    document.getElementById('sidebar-user-role').innerText = `${currentUser.role.toUpperCase()} • ${currentUser.studentId || currentUser.facultyId || 'PORTAL'}`;
    const avatarEl = document.getElementById('sidebar-user-avatar');
    if (avatarEl) {
      avatarEl.innerText = currentUser.name.charAt(0);
    }

    // Build sidebar menu for current role
    renderSidebarNav();

    // Default route for role
    const defaultViews = {
      student: 'student-dashboard',
      faculty: 'faculty-dashboard',
      parent: 'parent-dashboard',
      admin: 'admin-dashboard'
    };

    navigate(defaultViews[currentRole] || 'student-dashboard');
  }

  // Mobile sidebar toggle
  function toggleMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    sidebar.classList.toggle('mobile-open');
    backdrop.classList.toggle('mobile-open');
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    sidebar.classList.remove('mobile-open');
    backdrop.classList.remove('mobile-open');
  }

  // Navigation Items Definitions
  const NAV_CONFIG = {
    student: [
      { id: 'student-dashboard', label: 'Dashboard', icon: 'grid', title: 'Student Dashboard', subtitle: 'Academic summary, attendance status, and alerts' },
      { id: 'student-attendance', label: 'Attendance Records', icon: 'check-circle', title: 'Attendance Management', subtitle: 'Subject-wise class attendance and eligibility calculator' },
      { id: 'student-courses', label: 'Course Registration', icon: 'book', title: 'Flexible Credit System', subtitle: 'Elective course enrollment and credit tracking' },
      { id: 'student-exams', label: 'Examinations & Results', icon: 'award', title: 'Examination Portal', subtitle: 'Exam schedules, hall ticket download, and semester marks' },
      { id: 'student-fees', label: 'Fee Management', icon: 'credit-card', title: 'University Fee Management', subtitle: 'Tuition fees, dues, online payment, and receipts' },
      { id: 'student-grievance', label: 'Grievance Portal', icon: 'message-square', title: 'Student Grievance Cell', subtitle: 'Submit academic/infrastructure complaints and track resolution' },
      { id: 'student-notices', label: 'Notifications', icon: 'bell', title: 'University Circulars', subtitle: 'Important notifications, exams, and attendance warnings' }
    ],
    faculty: [
      { id: 'faculty-dashboard', label: 'Faculty Dashboard', icon: 'grid', title: 'Faculty Workspace', subtitle: 'Classes assigned, teaching schedule, and pending tasks' },
      { id: 'faculty-attendance', label: 'Mark Attendance', icon: 'check-square', title: 'Attendance Management', subtitle: 'Interactive student attendance entry and roster logging' },
      { id: 'faculty-marks', label: 'Upload Marks', icon: 'edit-3', title: 'Evaluation & Marks Entry', subtitle: 'Internal assessments, midterm grading, and marks publication' },
      { id: 'faculty-announcements', label: 'Post Announcements', icon: 'volume-2', title: 'Faculty Notices', subtitle: 'Broadcast class notices, assignment updates, and alerts' },
      { id: 'faculty-students', label: 'Student Directory', icon: 'users', title: 'Mentee & Student List', subtitle: 'Search and inspect student performance & contact details' }
    ],
    parent: [
      { id: 'parent-dashboard', label: 'Ward Overview', icon: 'home', title: 'Parent Portal - Overview', subtitle: 'Monitor child attendance, grade progression, and notifications' },
      { id: 'parent-attendance', label: 'Attendance Monitor', icon: 'pie-chart', title: 'Child Attendance Tracker', subtitle: 'Detailed subject-wise attendance and minimum 75% rule alert' },
      { id: 'parent-grades', label: 'Report Card & Grades', icon: 'file-text', title: 'Academic Performance', subtitle: 'Semester results, grade sheet, and SGPA progression' },
      { id: 'parent-fees', label: 'Fee Status & Pay', icon: 'dollar-sign', title: 'Fee Payment Status', subtitle: 'Check pending university dues and pay online directly' },
      { id: 'parent-mentor', label: 'Faculty Mentor', icon: 'mail', title: 'Faculty Advisor Contact', subtitle: 'Direct communication with assigned faculty mentor' }
    ],
    admin: [
      { id: 'admin-dashboard', label: 'Overview', icon: 'bar-chart-2', title: 'University Administrator Hub', subtitle: 'Central analytics, KPI monitoring, and operational status' },
      { id: 'admin-students', label: 'Manage Students', icon: 'user-check', title: 'Student Administration', subtitle: 'View, add, edit, or remove registered students' },
      { id: 'admin-faculty', label: 'Manage Faculty', icon: 'briefcase', title: 'Faculty Management', subtitle: 'Faculty roster, department assignments, and workload' },
      { id: 'admin-courses', label: 'Course Catalog', icon: 'layers', title: 'Academic Course Catalog', subtitle: 'Manage core subjects, electives, credits, and capacity' },
      { id: 'admin-grievances', label: 'Grievance Desk', icon: 'inbox', title: 'University Grievance Desk', subtitle: 'Review and resolve student grievances with administrative remarks' },
      { id: 'admin-announcements', label: 'Campus Notices', icon: 'send', title: 'University Circulars & Alerts', subtitle: 'Issue university-wide official announcements and alerts' }
    ]
  };

  function renderSidebarNav() {
    const navEl = document.getElementById('sidebar-nav');
    const items = NAV_CONFIG[currentRole] || [];

    let html = `<div class="nav-section-title">${currentRole.toUpperCase()} NAVIGATION</div>`;
    
    items.forEach(item => {
      const isActive = item.id === currentView ? 'active' : '';
      html += `
        <a class="nav-item ${isActive}" onclick="UniApp.navigate('${item.id}')" data-view="${item.id}">
          <span style="font-size: 16px;">${getNavIcon(item.icon)}</span>
          <span>${item.label}</span>
        </a>
      `;
    });

    navEl.innerHTML = html;
  }

  function getNavIcon(name) {
    const iconMap = {
      'grid': '📊',
      'check-circle': '📅',
      'book': '📚',
      'award': '🏆',
      'credit-card': '💳',
      'message-square': '📨',
      'bell': '🔔',
      'check-square': '📝',
      'edit-3': '✍️',
      'volume-2': '📢',
      'users': '👥',
      'home': '🏠',
      'pie-chart': '📈',
      'file-text': '📑',
      'dollar-sign': '💰',
      'mail': '✉️',
      'bar-chart-2': '🏛️',
      'user-check': '🎓',
      'briefcase': '👩‍🏫',
      'layers': '📖',
      'inbox': '📬',
      'send': '📡'
    };
    return iconMap[name] || '📌';
  }

  function navigate(viewId) {
    currentView = viewId;
    closeMobileSidebar();

    // Update active nav styling
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => {
      if (el.getAttribute('data-view') === viewId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Find nav item config to update header
    const allItems = [
      ...NAV_CONFIG.student,
      ...NAV_CONFIG.faculty,
      ...NAV_CONFIG.parent,
      ...NAV_CONFIG.admin
    ];
    const config = allItems.find(i => i.id === viewId);
    if (config) {
      document.getElementById('page-header-title').innerText = config.title;
      document.getElementById('page-header-subtitle').innerText = config.subtitle;
    }

    // Render corresponding view
    const mainView = document.getElementById('main-content-view');
    mainView.innerHTML = renderViewHTML(viewId);

    // Post-render bindings
    attachViewEvents(viewId);
  }

  function openAnnouncements() {
    if (currentRole === 'student') navigate('student-notices');
    else if (currentRole === 'faculty') navigate('faculty-announcements');
    else if (currentRole === 'admin') navigate('admin-announcements');
    else navigate('parent-dashboard');
  }

  // =========================================================
  // VIEW RENDERERS
  // =========================================================

  function renderViewHTML(viewId) {
    switch (viewId) {
      // Student Views
      case 'student-dashboard': return renderStudentDashboard();
      case 'student-attendance': return renderStudentAttendance();
      case 'student-courses': return renderStudentCourses();
      case 'student-exams': return renderStudentExams();
      case 'student-fees': return renderStudentFees();
      case 'student-grievance': return renderStudentGrievances();
      case 'student-notices': return renderStudentNotices();

      // Faculty Views
      case 'faculty-dashboard': return renderFacultyDashboard();
      case 'faculty-attendance': return renderFacultyAttendance();
      case 'faculty-marks': return renderFacultyMarks();
      case 'faculty-announcements': return renderFacultyAnnouncements();
      case 'faculty-students': return renderFacultyStudents();

      // Parent Views
      case 'parent-dashboard': return renderParentDashboard();
      case 'parent-attendance': return renderParentAttendance();
      case 'parent-grades': return renderParentGrades();
      case 'parent-fees': return renderParentFees();
      case 'parent-mentor': return renderParentMentor();

      // Admin Views
      case 'admin-dashboard': return renderAdminDashboard();
      case 'admin-students': return renderAdminStudents();
      case 'admin-faculty': return renderAdminFaculty();
      case 'admin-courses': return renderAdminCourses();
      case 'admin-grievances': return renderAdminGrievances();
      case 'admin-announcements': return renderAdminAnnouncements();

      default: return `<div class="content-card"><div class="card-body"><h3>View not found: ${viewId}</h3></div></div>`;
    }
  }

  // =========================================================
  // 1. STUDENT VIEW RENDERERS
  // =========================================================

  function renderStudentDashboard() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001') || UniStorage.getStudents()[0];
    const attendanceRecords = UniStorage.getStudentAttendance(student.id);
    const fees = UniStorage.getStudentFees(student.id);
    const announcements = UniStorage.getAnnouncements();

    const lowAttCourses = attendanceRecords.filter(a => a.percentage < 75);
    const isExamEligible = student.attendanceOverall >= 75;

    return `
      <!-- Profile Welcome Banner -->
      <div class="profile-banner">
        <div class="profile-main-info">
          <div class="profile-avatar-large" style="display:flex;align-items:center;justify-content:center;font-size:28px;background:#1e3a8a;color:#fff;">
            🎓
          </div>
          <div class="profile-title-text">
            <h2>Welcome back, ${student.name}!</h2>
            <div class="profile-details-line">
              <span><strong>Roll No:</strong> ${student.rollNo}</span>
              <span>•</span>
              <span><strong>Program:</strong> B.Tech ${student.department}</span>
              <span>•</span>
              <span><strong>Semester:</strong> VI (Section ${student.section})</span>
              <span>•</span>
              <span><strong>Academic Mentor:</strong> ${student.mentor}</span>
            </div>
          </div>
        </div>
        <div class="profile-stat-pills">
          <div class="profile-pill">
            <div class="profile-pill-val">${student.cgpa}</div>
            <div class="profile-pill-lbl">Current CGPA</div>
          </div>
          <div class="profile-pill">
            <div class="profile-pill-val">${student.attendanceOverall}%</div>
            <div class="profile-pill-lbl">Overall Attendance</div>
          </div>
        </div>
      </div>

      <!-- Low Attendance Alert (if any) -->
      ${lowAttCourses.length > 0 ? `
        <div class="alert-box alert-warning">
          <span style="font-size: 20px;">⚠️</span>
          <div>
            <strong>Attendance Warning Notice:</strong> Your attendance is below the university threshold (75%) in 
            <strong>${lowAttCourses.map(c => `${c.courseTitle} (${c.percentage}%)`).join(', ')}</strong>.
            Please ensure regular attendance or submit medical proof for condonation to avoid exam debarment.
          </div>
        </div>
      ` : ''}

      <!-- Quick KPI Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Overall Attendance</span>
            <span class="stat-value" style="color: ${student.attendanceOverall >= 75 ? 'var(--success)' : 'var(--danger)'};">
              ${student.attendanceOverall}%
            </span>
            <span class="stat-trend ${isExamEligible ? 'trend-positive' : 'trend-warning'}">
              ${isExamEligible ? '✓ Eligible for Final Exams' : '⚠️ Low Attendance Alert'}
            </span>
          </div>
          <div class="stat-icon-wrapper icon-blue">📊</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Semester SGPA</span>
            <span class="stat-value">${student.sgpa}</span>
            <span class="stat-trend trend-positive">Cumulative CGPA: ${student.cgpa}</span>
          </div>
          <div class="stat-icon-wrapper icon-green">🏆</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Credits Earned</span>
            <span class="stat-value">${student.creditsEarned} Cr</span>
            <span class="stat-trend">Current Sem: ${student.currentSemesterCredits || 11} Credits</span>
          </div>
          <div class="stat-icon-wrapper icon-purple">📚</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Fee Dues</span>
            <span class="stat-value" style="color: ${fees && fees.totalPending > 0 ? 'var(--danger)' : 'var(--success)'};">
              ₹${fees ? fees.totalPending.toLocaleString() : '0'}
            </span>
            <span class="stat-trend ${fees && fees.totalPending > 0 ? 'trend-warning' : 'trend-positive'}">
              ${fees && fees.totalPending > 0 ? 'Due by 30th Nov' : 'All Clear'}
            </span>
          </div>
          <div class="stat-icon-wrapper icon-amber">💳</div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="grid-2-1">
        <!-- Left: Registered Courses & Attendance Snapshot -->
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>📖</span> Enrolled Courses & Attendance Snapshot
            </div>
            <button class="btn-secondary btn-sm" onclick="UniApp.navigate('student-courses')">Manage Electives</button>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Credits</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${attendanceRecords.map(a => {
                    const crs = UniStorage.getCourseByCode(a.courseCode);
                    return `
                      <tr>
                        <td>
                          <strong>${a.courseCode}</strong><br>
                          <span style="font-size:12px;color:var(--text-muted);">${a.courseTitle}</span>
                        </td>
                        <td>${crs ? crs.credits : 3} Cr</td>
                        <td style="min-width: 130px;">
                          <div style="display:flex; justify-content:space-between; margin-bottom: 4px; font-weight: 600;">
                            <span>${a.percentage}%</span>
                            <span style="font-size: 11px; color: var(--text-muted);">${a.attendedHours}/${a.totalHours} hrs</span>
                          </div>
                          <div class="progress-bar-bg">
                            <div class="progress-bar-fill ${a.percentage >= 75 ? 'progress-good' : (a.percentage >= 65 ? 'progress-warning' : 'progress-danger')}" style="width: ${Math.min(100, a.percentage)}%;"></div>
                          </div>
                        </td>
                        <td>
                          <span class="badge ${a.percentage >= 75 ? 'badge-success' : 'badge-danger'}">
                            ${a.percentage >= 75 ? 'Eligible' : 'Warning'}
                          </span>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right: Recent Announcements & Upcoming Deadlines -->
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>📢</span> University Bulletins
            </div>
            <button class="btn-secondary btn-sm" onclick="UniApp.navigate('student-notices')">View All</button>
          </div>
          <div class="card-body p-0">
            ${announcements.slice(0, 3).map(ann => `
              <div class="notice-item">
                <div class="notice-top">
                  <span class="badge ${ann.urgent ? 'badge-danger' : 'badge-primary'}">${ann.category}</span>
                  <span style="font-size: 11px; color: var(--text-light);">${ann.date}</span>
                </div>
                <div class="notice-title" style="margin-bottom: 4px; font-size: 13px;">${ann.title}</div>
                <div class="notice-body" style="font-size: 12px; margin-bottom: 0;">${ann.content.substring(0, 110)}...</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderStudentAttendance() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const records = UniStorage.getStudentAttendance(student.id);

    return `
      <!-- Policy Explainer Banner -->
      <div class="alert-box alert-info">
        <span style="font-size: 20px;">ℹ️</span>
        <div>
          <strong>Nagarjuna University Attendance Regulations:</strong>
          A minimum of <strong>75% attendance</strong> in each registered course is mandatory for appearing in the End-Semester Examinations.
          Students with attendance between <strong>65% and 74.9%</strong> due to validated medical grounds or inter-college sports/technical representations may apply for <strong>Attendance Condonation</strong> below.
        </div>
      </div>

      <!-- Attendance Table -->
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>📅</span> Subject-Wise Attendance Breakdown (Semester VI)
          </div>
          <button class="btn-primary btn-sm" style="width: auto;" onclick="UniApp.openCondonationModal()">
            <span>📝</span> Request Attendance Condonation / OD
          </button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Total Classes Conducted</th>
                  <th>Attended Classes</th>
                  <th>Percentage</th>
                  <th>Deficit Classes to reach 75%</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${records.map(r => {
                  const neededClasses = r.percentage < 75 ? Math.ceil((0.75 * r.totalHours - r.attendedHours) / 0.25) : 0;
                  return `
                    <tr>
                      <td><strong>${r.courseCode}</strong></td>
                      <td>${r.courseTitle}</td>
                      <td>${r.totalHours} Hours</td>
                      <td><strong>${r.attendedHours}</strong> Hours</td>
                      <td>
                        <div style="display:flex; align-items:center; gap: 8px;">
                          <div class="progress-bar-bg" style="width: 80px;">
                            <div class="progress-bar-fill ${r.percentage >= 75 ? 'progress-good' : (r.percentage >= 65 ? 'progress-warning' : 'progress-danger')}" style="width: ${Math.min(100, r.percentage)}%;"></div>
                          </div>
                          <strong>${r.percentage}%</strong>
                        </div>
                      </td>
                      <td>
                        ${r.percentage < 75 
                          ? `<span style="color: var(--danger); font-weight: 600;">Need to attend next ${Math.max(1, neededClasses)} classes</span>` 
                          : `<span style="color: var(--success);">Above Threshold</span>`}
                      </td>
                      <td>
                        <span class="badge ${r.percentage >= 75 ? 'badge-success' : (r.percentage >= 65 ? 'badge-warning' : 'badge-danger')}">
                          ${r.percentage >= 75 ? 'Eligible' : (r.percentage >= 65 ? 'Condonation Required' : 'Critical Debarred')}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderStudentCourses() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const allCourses = UniStorage.getCourses();
    const enrolledSet = new Set(student.enrolledCourses || []);

    const totalRegisteredCredits = (student.enrolledCourses || []).reduce((sum, code) => {
      const c = allCourses.find(item => item.code === code);
      return sum + (c ? c.credits : 0);
    }, 0);

    return `
      <!-- Flexible Credit System Banner -->
      <div class="alert-box alert-info">
        <span style="font-size: 20px;">🎓</span>
        <div>
          <strong>Flexible Credit-Based Academic System (CBCS):</strong>
          Under this system, you can choose specialized electives aligned with your career track.
          Minimum requirement: <strong>18 Credits</strong> • Maximum allowed: <strong>24 Credits</strong> per semester.
          You currently have <strong>${totalRegisteredCredits} Credits</strong> enrolled.
        </div>
      </div>

      <!-- Enrolled Courses -->
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>✅</span> Currently Enrolled Courses (${student.enrolledCourses.length} Subjects • ${totalRegisteredCredits} Credits)
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Credits</th>
                  <th>Faculty Instructor</th>
                  <th>Schedule</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${student.enrolledCourses.map(code => {
                  const course = allCourses.find(c => c.code === code);
                  if (!course) return '';
                  return `
                    <tr>
                      <td><strong>${course.code}</strong></td>
                      <td><strong>${course.title}</strong></td>
                      <td><span class="badge ${course.type === 'Core' ? 'badge-primary' : 'badge-info'}">${course.type}</span></td>
                      <td><strong>${course.credits} Cr</strong></td>
                      <td>${course.facultyName}</td>
                      <td>${course.schedule}</td>
                      <td>
                        ${course.type === 'Core' 
                          ? `<span style="font-size: 11px; color: var(--text-muted);">Mandatory Core</span>`
                          : `<button class="btn-danger btn-sm" onclick="UniApp.dropCourse('${course.code}')">Drop Elective</button>`}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Available Electives Catalog -->
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>✨</span> Available Elective & Interdisciplinary Courses
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course Title & Description</th>
                  <th>Credits</th>
                  <th>Faculty</th>
                  <th>Seats Remaining</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${allCourses.filter(c => c.type !== 'Core').map(course => {
                  const isEnrolled = enrolledSet.has(course.code);
                  const seatsLeft = course.maxCapacity - (course.enrolledCount || 0);
                  return `
                    <tr>
                      <td><strong>${course.code}</strong></td>
                      <td>
                        <strong>${course.title}</strong>
                        <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${course.description}</p>
                        <div style="font-size: 11px; color: var(--primary); margin-top: 2px;"><strong>Syllabus Highlights:</strong> ${course.syllabus}</div>
                      </td>
                      <td><strong>${course.credits} Cr</strong></td>
                      <td>${course.facultyName}</td>
                      <td>
                        <span class="badge ${seatsLeft > 10 ? 'badge-success' : (seatsLeft > 0 ? 'badge-warning' : 'badge-danger')}">
                          ${seatsLeft > 0 ? `${seatsLeft} seats left` : 'Full'}
                        </span>
                      </td>
                      <td>
                        ${isEnrolled 
                          ? `<span class="badge badge-success">Enrolled</span>`
                          : `<button class="btn-primary btn-sm" ${seatsLeft <= 0 ? 'disabled style="opacity:0.5;"' : ''} onclick="UniApp.registerCourse('${course.code}')">Register</button>`}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderStudentExams() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const examSchedules = UniStorage.getExamSchedules();
    const results = UniStorage.getStudentResults(student.id);

    return `
      <!-- Exam Actions Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 18px; font-weight: 700; color: var(--dark-navy);">End Semester Examinations (Nov / Dec 2026)</h2>
          <p style="font-size: 12px; color: var(--text-muted);">Hall ticket verified for B.Tech Semester VI examinations</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn-primary" style="width: auto;" onclick="UniApp.openHallTicketModal()">
            <span>🎟️</span> Download / Print Hall Ticket
          </button>
        </div>
      </div>

      <!-- Upcoming Examination Timetable -->
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>🗓️</span> Examination Schedule & Seating Allotment
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Exam Type</th>
                  <th>Date</th>
                  <th>Timing</th>
                  <th>Examination Hall</th>
                  <th>Seat Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${examSchedules.map(e => `
                  <tr>
                    <td><strong>${e.courseCode}</strong></td>
                    <td><strong>${e.courseTitle}</strong></td>
                    <td>${e.examType}</td>
                    <td><strong style="color: var(--primary);">${e.date}</strong></td>
                    <td>${e.time} (${e.duration})</td>
                    <td>${e.hall}</td>
                    <td><span class="badge badge-primary">${e.seatNo}</span></td>
                    <td><span class="badge badge-warning">${e.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Ongoing Semester Internal Assessment -->
      ${results && results.currentSemesterInternal ? `
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>📊</span> Semester VI Continuous Internal Evaluation (CIE Marks)
            </div>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Internal Test 1 (30)</th>
                    <th>Internal Test 2 (30)</th>
                    <th>Assignment & Lab (10)</th>
                    <th>Total Internal (70)</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  ${results.currentSemesterInternal.map(r => `
                    <tr>
                      <td><strong>${r.courseCode}</strong></td>
                      <td>${r.courseTitle}</td>
                      <td>${r.internal1} / 30</td>
                      <td>${r.internal2} / 30</td>
                      <td>${r.assignment} / 10</td>
                      <td><strong>${r.totalInternal} / 70</strong></td>
                      <td><span class="badge badge-success">${r.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Past Semesters Grade Sheets -->
      ${results && results.pastSemesters ? `
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>📜</span> Official Published Semester Results (Semester V)
            </div>
            <div class="badge badge-success" style="font-size: 13px;">SGPA: ${results.pastSemesters[0].sgpa} • ${results.pastSemesters[0].result}</div>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Credits</th>
                    <th>Marks Scored (100)</th>
                    <th>Letter Grade</th>
                    <th>Grade Points</th>
                  </tr>
                </thead>
                <tbody>
                  ${results.pastSemesters[0].subjects.map(s => `
                    <tr>
                      <td><strong>${s.code}</strong></td>
                      <td>${s.title}</td>
                      <td>${s.credits}</td>
                      <td>${s.marks}</td>
                      <td><span class="badge ${s.grade === 'O' || s.grade === 'A+' ? 'badge-success' : 'badge-primary'}">${s.grade}</span></td>
                      <td><strong>${s.points}</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }

  function renderStudentFees() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const feeData = UniStorage.getStudentFees(student.id);

    if (!feeData) return `<div class="content-card"><div class="card-body">No fee records found.</div></div>`;

    return `
      <!-- Fee Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Total Annual Fee</span>
            <span class="stat-value">₹${feeData.totalPayable.toLocaleString()}</span>
            <span class="stat-trend">Academic Year 2026-27</span>
          </div>
          <div class="stat-icon-wrapper icon-blue">💰</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Total Paid Amount</span>
            <span class="stat-value" style="color: var(--success);">₹${feeData.totalPaid.toLocaleString()}</span>
            <span class="stat-trend trend-positive">Verified Receipts Available</span>
          </div>
          <div class="stat-icon-wrapper icon-green">✅</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Outstanding Balance</span>
            <span class="stat-value" style="color: ${feeData.totalPending > 0 ? 'var(--danger)' : 'var(--success)'};">
              ₹${feeData.totalPending.toLocaleString()}
            </span>
            <span class="stat-trend ${feeData.totalPending > 0 ? 'trend-warning' : 'trend-positive'}">
              ${feeData.totalPending > 0 ? 'Hostel & Mess Dues' : 'No dues pending'}
            </span>
          </div>
          <div class="stat-icon-wrapper icon-amber">⏳</div>
        </div>
      </div>

      <!-- Fee Breakdown Table -->
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>💳</span> Semester VI Fee Structure & Dues
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fee Description</th>
                  <th>Due Date</th>
                  <th>Total Amount</th>
                  <th>Paid Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${feeData.breakdown.map(item => `
                  <tr>
                    <td><strong>${item.feeType}</strong></td>
                    <td>${item.dueDate}</td>
                    <td><strong>₹${item.amount.toLocaleString()}</strong></td>
                    <td>₹${(item.paidAmount || 0).toLocaleString()}</td>
                    <td>
                      <span class="badge ${item.status === 'Paid' ? 'badge-success' : 'badge-danger'}">
                        ${item.status}
                      </span>
                    </td>
                    <td>
                      ${item.status === 'Paid' 
                        ? `<button class="btn-secondary btn-sm" onclick="UniApp.viewReceipt('${item.receiptNo}')">📄 View Receipt</button>` 
                        : `<button class="btn-primary btn-sm" onclick="UniApp.openPayFeeModal('${item.id}', '${item.feeType}', ${item.amount - (item.paidAmount || 0)})">💳 Pay Online Now</button>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Payment History Table -->
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>🧾</span> Payment Transaction History
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Payment Date</th>
                  <th>Fee Head</th>
                  <th>Amount Paid</th>
                  <th>Payment Method</th>
                  <th>Transaction ID</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                ${(feeData.paymentHistory || []).map(hist => `
                  <tr>
                    <td><strong>${hist.receiptNo}</strong></td>
                    <td>${hist.date}</td>
                    <td>${hist.description}</td>
                    <td><strong style="color: var(--success);">₹${hist.amount.toLocaleString()}</strong></td>
                    <td>${hist.paymentMode}</td>
                    <td><code>${hist.transactionId}</code></td>
                    <td>
                      <button class="btn-secondary btn-sm" onclick="UniApp.viewReceipt('${hist.receiptNo}')">Print Receipt</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderStudentGrievances() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const grievances = UniStorage.getGrievances(student.id);

    return `
      <!-- Action Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 18px; font-weight: 700; color: var(--dark-navy);">Student Grievance Redressal Portal</h2>
          <p style="font-size: 12px; color: var(--text-muted);">Directly submit and track complaints to the University Redressal Committee</p>
        </div>
        <button class="btn-primary" style="width: auto;" onclick="UniApp.openSubmitGrievanceModal()">
          <span>➕</span> Lodge New Grievance
        </button>
      </div>

      <!-- Grievance Tickets List -->
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>📨</span> My Grievance Tickets (${grievances.length})
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Category</th>
                  <th>Subject / Description</th>
                  <th>Date Filed</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Resolution Status</th>
                </tr>
              </thead>
              <tbody>
                ${grievances.length === 0 ? `
                  <tr><td colspan="7" style="text-align:center; padding: 24px;">No grievance tickets filed yet.</td></tr>
                ` : grievances.map(g => `
                  <tr>
                    <td><strong>${g.id}</strong></td>
                    <td><span class="badge badge-primary">${g.category}</span></td>
                    <td>
                      <strong>${g.title}</strong>
                      <p style="font-size: 12px; color: var(--text-muted); margin-top: 3px;">${g.description}</p>
                    </td>
                    <td>${g.submittedDate}</td>
                    <td>
                      <span class="badge ${g.priority === 'High' ? 'badge-danger' : (g.priority === 'Medium' ? 'badge-warning' : 'badge-neutral')}">
                        ${g.priority}
                      </span>
                    </td>
                    <td>
                      <span class="badge ${g.status === 'Resolved' ? 'badge-success' : (g.status === 'Under Review' ? 'badge-info' : 'badge-warning')}">
                        ${g.status}
                      </span>
                    </td>
                    <td style="max-width: 220px;">
                      ${g.adminNote ? `
                        <div style="font-size: 12px; background: #f8fafc; padding: 6px 10px; border-radius: 6px; border-left: 3px solid var(--primary);">
                          <strong>Admin Response:</strong> ${g.adminNote}
                          ${g.resolvedDate ? `<div style="font-size: 10px; color: var(--text-light); margin-top: 2px;">Resolved on ${g.resolvedDate} by ${g.resolvedBy}</div>` : ''}
                        </div>
                      ` : `<span style="font-size: 12px; color: var(--text-muted);">Assigned to Redressal Officer</span>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderStudentNotices() {
    const announcements = UniStorage.getAnnouncements();

    return `
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>📢</span> Official University Notices & Circulars
          </div>
        </div>
        <div class="card-body p-0">
          ${announcements.map(ann => `
            <div class="notice-item">
              <div class="notice-top">
                <div style="display:flex; align-items:center; gap: 8px;">
                  <span class="badge ${ann.urgent ? 'badge-danger' : 'badge-primary'}">${ann.category}</span>
                  ${ann.urgent ? `<span class="badge badge-danger">⚡ URGENT</span>` : ''}
                  <span style="font-size: 11px; color: var(--text-muted);">Audience: ${ann.audience}</span>
                </div>
                <span style="font-size: 12px; color: var(--text-light);">${ann.date}</span>
              </div>
              <div class="notice-title" style="font-size: 15px; margin-bottom: 6px;">${ann.title}</div>
              <div class="notice-body">${ann.content}</div>
              <div class="notice-meta">
                <span>Issued by: <strong>${ann.author}</strong></span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================
  // 2. FACULTY VIEW RENDERERS
  // =========================================================

  function renderFacultyDashboard() {
    const faculty = UniStorage.getFacultyById(currentUser.facultyId || 'FAC-101') || UniStorage.getFacultyList()[0];
    const courses = UniStorage.getCourses().filter(c => faculty.assignedCourses.includes(c.code));
    const allStudents = UniStorage.getStudents();

    return `
      <!-- Faculty Profile Banner -->
      <div class="profile-banner">
        <div class="profile-main-info">
          <div class="profile-avatar-large" style="display:flex;align-items:center;justify-content:center;font-size:28px;background:#1e3a8a;color:#fff;">
            👩‍🏫
          </div>
          <div class="profile-title-text">
            <h2>${faculty.name}</h2>
            <div class="profile-details-line">
              <span><strong>Designation:</strong> ${faculty.designation}</span>
              <span>•</span>
              <span><strong>Department:</strong> ${faculty.department}</span>
              <span>•</span>
              <span><strong>Office:</strong> ${faculty.office}</span>
              <span>•</span>
              <span><strong>Experience:</strong> ${faculty.experience}</span>
            </div>
          </div>
        </div>
        <div class="profile-stat-pills">
          <div class="profile-pill">
            <div class="profile-pill-val">${faculty.assignedCourses.length}</div>
            <div class="profile-pill-lbl">Assigned Courses</div>
          </div>
          <div class="profile-pill">
            <div class="profile-pill-val">${faculty.menteesCount}</div>
            <div class="profile-pill-lbl">Student Mentees</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Shortcuts -->
      <div class="stats-grid">
        <div class="stat-card" style="cursor: pointer;" onclick="UniApp.navigate('faculty-attendance')">
          <div class="stat-info">
            <span class="stat-label">Attendance Desk</span>
            <span class="stat-value">Take Attendance</span>
            <span class="stat-trend trend-positive">Select Class & Mark</span>
          </div>
          <div class="stat-icon-wrapper icon-blue">📝</div>
        </div>

        <div class="stat-card" style="cursor: pointer;" onclick="UniApp.navigate('faculty-marks')">
          <div class="stat-info">
            <span class="stat-label">Evaluation Desk</span>
            <span class="stat-value">Enter Marks</span>
            <span class="stat-trend">Internal Assessment 1 & 2</span>
          </div>
          <div class="stat-icon-wrapper icon-green">✍️</div>
        </div>

        <div class="stat-card" style="cursor: pointer;" onclick="UniApp.navigate('faculty-announcements')">
          <div class="stat-info">
            <span class="stat-label">Broadcast Notice</span>
            <span class="stat-value">Post Circular</span>
            <span class="stat-trend">Send to students</span>
          </div>
          <div class="stat-icon-wrapper icon-purple">📢</div>
        </div>

        <div class="stat-card" style="cursor: pointer;" onclick="UniApp.navigate('faculty-students')">
          <div class="stat-info">
            <span class="stat-label">Student Records</span>
            <span class="stat-value">${allStudents.length} Active</span>
            <span class="stat-trend">View Attendance & CGPA</span>
          </div>
          <div class="stat-icon-wrapper icon-amber">👥</div>
        </div>
      </div>

      <!-- Assigned Subjects Table -->
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>📚</span> Assigned Teaching Allocations (Semester VI)
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Type</th>
                  <th>Credits</th>
                  <th>Schedule</th>
                  <th>Classroom</th>
                  <th>Enrollment</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                ${courses.map(c => `
                  <tr>
                    <td><strong>${c.code}</strong></td>
                    <td><strong>${c.title}</strong></td>
                    <td><span class="badge ${c.type === 'Core' ? 'badge-primary' : 'badge-info'}">${c.type}</span></td>
                    <td>${c.credits} Cr</td>
                    <td>${c.schedule}</td>
                    <td>${c.room}</td>
                    <td><span class="badge badge-success">${c.enrolledCount} / ${c.maxCapacity}</span></td>
                    <td>
                      <div style="display:flex; gap:6px;">
                        <button class="btn-primary btn-sm" onclick="UniApp.quickTakeAttendance('${c.code}')">Mark Attendance</button>
                        <button class="btn-secondary btn-sm" onclick="UniApp.quickEnterMarks('${c.code}')">Upload Marks</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderFacultyAttendance() {
    const faculty = UniStorage.getFacultyById(currentUser.facultyId || 'FAC-101');
    const courses = UniStorage.getCourses().filter(c => (faculty.assignedCourses || []).includes(c.code));
    const defaultCourse = courses[0] ? courses[0].code : 'CS601';
    const students = UniStorage.getStudents();
    const today = new Date().toISOString().split('T')[0];

    return `
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>📝</span> Daily Attendance Entry Roster
          </div>
        </div>
        <div class="card-body">
          <form id="faculty-attendance-form" onsubmit="UniApp.handleSaveAttendance(event)">
            <div class="grid-3" style="margin-bottom: 20px;">
              <div class="form-group">
                <label class="form-label">Select Course</label>
                <select id="att-course-select" class="form-input" onchange="UniApp.reloadAttendanceRoster(this.value)">
                  ${courses.map(c => `<option value="${c.code}">${c.code} - ${c.title}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Date of Lecture</label>
                <input type="date" id="att-date-input" class="form-input" value="${today}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Lecture Topic / Module Covered</label>
                <input type="text" id="att-topic-input" class="form-input" placeholder="e.g. Distributed Consensus & Raft Algorithm" required value="Distributed Concurrency & ACID">
              </div>
            </div>

            <!-- Fast Batch Action -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
              <span style="font-size: 13px; font-weight: 600;">Student Roster (<span id="roster-count">${students.length}</span> Students)</span>
              <div style="display: flex; gap: 8px;">
                <button type="button" class="btn-secondary btn-sm" onclick="UniApp.setAllAttendanceStatus('Present')">Mark All Present</button>
                <button type="button" class="btn-secondary btn-sm" onclick="UniApp.setAllAttendanceStatus('Absent')">Mark All Absent</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Department</th>
                    <th>Current Overall %</th>
                    <th style="width: 260px;">Attendance Status</th>
                  </tr>
                </thead>
                <tbody id="attendance-roster-tbody">
                  ${students.map(s => `
                    <tr>
                      <td><strong>${s.rollNo}</strong></td>
                      <td><strong>${s.name}</strong></td>
                      <td>${s.department}</td>
                      <td>
                        <span class="badge ${s.attendanceOverall >= 75 ? 'badge-success' : 'badge-danger'}">
                          ${s.attendanceOverall}%
                        </span>
                      </td>
                      <td>
                        <div style="display: flex; gap: 12px;">
                          <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; color: var(--success-text); font-weight: 600;">
                            <input type="radio" name="att_status_${s.id}" value="Present" checked> Present
                          </label>
                          <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; color: var(--danger-text); font-weight: 600;">
                            <input type="radio" name="att_status_${s.id}" value="Absent"> Absent
                          </label>
                          <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; color: var(--warning-text); font-weight: 600;">
                            <input type="radio" name="att_status_${s.id}" value="Late"> Late (OD)
                          </label>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
              <button type="submit" class="btn-primary" style="width: auto;">
                <span>💾</span> Save & Submit Attendance to University Registry
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderFacultyMarks() {
    const faculty = UniStorage.getFacultyById(currentUser.facultyId || 'FAC-101');
    const courses = UniStorage.getCourses().filter(c => (faculty.assignedCourses || []).includes(c.code));
    const defaultCourse = courses[0] ? courses[0].code : 'CS601';
    const marksData = UniStorage.getFacultyMarks(defaultCourse);

    return `
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>✍️</span> Continuous Internal Evaluation (CIE) Marks Entry
          </div>
        </div>
        <div class="card-body">
          <div class="grid-2" style="margin-bottom: 20px;">
            <div class="form-group">
              <label class="form-label">Course Subject</label>
              <select id="marks-course-select" class="form-input" onchange="UniApp.reloadMarksTable(this.value)">
                ${courses.map(c => `<option value="${c.code}">${c.code} - ${c.title}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Evaluation Scheme</label>
              <select class="form-input">
                <option>Internal Assessment 1 & 2 + Assignments (Max 70 Marks)</option>
              </select>
            </div>
          </div>

          <form onsubmit="UniApp.handleSaveMarks(event)">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Internal Test 1 (Max 30)</th>
                    <th>Internal Test 2 (Max 30)</th>
                    <th>Assignments & Lab (Max 10)</th>
                    <th>Auto Total (70)</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody id="marks-table-tbody">
                  ${marksData.map((m, idx) => `
                    <tr>
                      <td><strong>${m.rollNo}</strong><input type="hidden" name="studentId_${idx}" value="${m.studentId}"></td>
                      <td>${m.studentName}</td>
                      <td>
                        <input type="number" name="test1_${idx}" class="form-input" min="0" max="30" value="${m.test1}" style="width: 80px;" oninput="UniApp.recalcRowTotal(${idx})">
                      </td>
                      <td>
                        <input type="number" name="test2_${idx}" class="form-input" min="0" max="30" value="${m.test2}" style="width: 80px;" oninput="UniApp.recalcRowTotal(${idx})">
                      </td>
                      <td>
                        <input type="number" name="assign_${idx}" class="form-input" min="0" max="10" value="${m.assignment}" style="width: 80px;" oninput="UniApp.recalcRowTotal(${idx})">
                      </td>
                      <td>
                        <strong id="total_marks_${idx}">${m.test1 + m.test2 + m.assignment} / 70</strong>
                      </td>
                      <td>
                        <span class="badge badge-success" id="grade_badge_${idx}">${m.grade}</span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
              <button type="submit" class="btn-primary" style="width: auto;">
                <span>🚀</span> Save & Publish Internal Marks to Student Portal
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderFacultyAnnouncements() {
    const announcements = UniStorage.getAnnouncements();

    return `
      <div class="grid-1-2">
        <!-- Left: Form to Post Announcement -->
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>📢</span> Post New Announcement
            </div>
          </div>
          <div class="card-body">
            <form onsubmit="UniApp.handlePostAnnouncement(event)">
              <div class="form-group">
                <label class="form-label">Notice Title</label>
                <input type="text" id="ann-title" class="form-input" placeholder="e.g. Lab Project Submission Deadline Extended" required>
              </div>

              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="ann-category" class="form-input">
                  <option value="Academic">Academic Notice</option>
                  <option value="Assignment">Assignment Submission</option>
                  <option value="Examination">Internal Exam Update</option>
                  <option value="Attendance">Attendance Alert</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Target Audience</label>
                <select id="ann-audience" class="form-input">
                  <option value="CSE 3rd Year Students">CSE 3rd Year Students</option>
                  <option value="All Students">All Students</option>
                  <option value="Parents & Students">Parents & Students</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Notice Content</label>
                <textarea id="ann-content" class="form-input" rows="4" placeholder="Type official notice details..." required></textarea>
              </div>

              <div class="form-group">
                <label style="display:flex; align-items:center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" id="ann-urgent"> Mark as Urgent Bulletin (Highlights in red)
                </label>
              </div>

              <button type="submit" class="btn-primary">
                <span>📡</span> Publish Announcement
              </button>
            </form>
          </div>
        </div>

        <!-- Right: Recent Published Notices -->
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>📋</span> University Feed
            </div>
          </div>
          <div class="card-body p-0">
            ${announcements.map(ann => `
              <div class="notice-item">
                <div class="notice-top">
                  <span class="badge ${ann.urgent ? 'badge-danger' : 'badge-primary'}">${ann.category}</span>
                  <span style="font-size: 11px; color: var(--text-light);">${ann.date}</span>
                </div>
                <div class="notice-title">${ann.title}</div>
                <div class="notice-body">${ann.content}</div>
                <div class="notice-meta">
                  <span>Author: ${ann.author}</span>
                  <span>Audience: ${ann.audience}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderFacultyStudents() {
    const students = UniStorage.getStudents();

    return `
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>👥</span> Student Roster & Mentee Directory
          </div>
          <div class="search-input-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search student by name or roll number..." oninput="UniApp.filterStudentTable(this.value)">
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table" id="faculty-students-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Department & Sem</th>
                  <th>Email & Phone</th>
                  <th>Attendance %</th>
                  <th>CGPA</th>
                  <th>Parent Info</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(s => `
                  <tr>
                    <td><strong>${s.rollNo}</strong></td>
                    <td><strong>${s.name}</strong></td>
                    <td>${s.department} (Sem ${s.semester})</td>
                    <td>${s.email}<br><span style="font-size:11px;color:var(--text-muted);">${s.phone}</span></td>
                    <td>
                      <span class="badge ${s.attendanceOverall >= 75 ? 'badge-success' : 'badge-danger'}">
                        ${s.attendanceOverall}%
                      </span>
                    </td>
                    <td><strong>${s.cgpa}</strong></td>
                    <td>${s.parentName}<br><span style="font-size:11px;color:var(--text-muted);">${s.parentPhone}</span></td>
                    <td>
                      <button class="btn-secondary btn-sm" onclick="UniApp.viewStudentProfileModal('${s.id}')">View Dossier</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================
  // 3. PARENT VIEW RENDERERS
  // =========================================================

  function renderParentDashboard() {
    const parent = currentUser;
    const student = UniStorage.getStudentById(parent.studentId || 'STU-2024-001') || UniStorage.getStudents()[0];
    const attendanceRecords = UniStorage.getStudentAttendance(student.id);
    const fees = UniStorage.getStudentFees(student.id);

    return `
      <!-- Parent-Child Profile Banner -->
      <div class="profile-banner">
        <div class="profile-main-info">
          <div class="profile-avatar-large" style="display:flex;align-items:center;justify-content:center;font-size:28px;background:#1e3a8a;color:#fff;">
            👨‍👦
          </div>
          <div class="profile-title-text">
            <h2>Parent Portal: ${parent.name}</h2>
            <div class="profile-details-line">
              <span><strong>Ward:</strong> ${student.name}</span>
              <span>•</span>
              <span><strong>Roll No:</strong> ${student.rollNo}</span>
              <span>•</span>
              <span><strong>Program:</strong> B.Tech ${student.department} (Semester VI)</span>
              <span>•</span>
              <span><strong>Faculty Advisor:</strong> ${student.mentor}</span>
            </div>
          </div>
        </div>
        <div class="profile-stat-pills">
          <div class="profile-pill">
            <div class="profile-pill-val">${student.attendanceOverall}%</div>
            <div class="profile-pill-lbl">Child Attendance</div>
          </div>
          <div class="profile-pill">
            <div class="profile-pill-val">${student.cgpa}</div>
            <div class="profile-pill-lbl">Current CGPA</div>
          </div>
        </div>
      </div>

      <!-- Quick KPI Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Child's Attendance</span>
            <span class="stat-value" style="color: ${student.attendanceOverall >= 75 ? 'var(--success)' : 'var(--danger)'};">
              ${student.attendanceOverall}%
            </span>
            <span class="stat-trend ${student.attendanceOverall >= 75 ? 'trend-positive' : 'trend-warning'}">
              ${student.attendanceOverall >= 75 ? '✓ Safe (Above 75% limit)' : '⚠️ Warning: Near minimum mark'}
            </span>
          </div>
          <div class="stat-icon-wrapper icon-blue">📊</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Academic Grade (CGPA)</span>
            <span class="stat-value">${student.cgpa} / 10.0</span>
            <span class="stat-trend trend-positive">First Class with Distinction</span>
          </div>
          <div class="stat-icon-wrapper icon-green">🏆</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">University Fee Due</span>
            <span class="stat-value" style="color: ${fees && fees.totalPending > 0 ? 'var(--danger)' : 'var(--success)'};">
              ₹${fees ? fees.totalPending.toLocaleString() : '0'}
            </span>
            <span class="stat-trend">Hostel Dues Pending</span>
          </div>
          <div class="stat-icon-wrapper icon-amber">💳</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Assigned Mentor</span>
            <span class="stat-value" style="font-size: 16px;">${student.mentor}</span>
            <span class="stat-trend trend-positive">Available Mon-Fri</span>
          </div>
          <div class="stat-icon-wrapper icon-purple">👩‍🏫</div>
        </div>
      </div>

      <!-- Attendance Breakdown for Parents -->
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>📅</span> Ward's Subject-Wise Attendance Status
          </div>
          <button class="btn-secondary btn-sm" onclick="UniApp.navigate('parent-attendance')">Full Report</button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Total Classes</th>
                  <th>Classes Attended</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${attendanceRecords.map(r => `
                  <tr>
                    <td><strong>${r.courseCode}</strong></td>
                    <td>${r.courseTitle}</td>
                    <td>${r.totalHours}</td>
                    <td>${r.attendedHours}</td>
                    <td>
                      <div style="display:flex; align-items:center; gap: 8px;">
                        <div class="progress-bar-bg" style="width: 80px;">
                          <div class="progress-bar-fill ${r.percentage >= 75 ? 'progress-good' : 'progress-danger'}" style="width: ${Math.min(100, r.percentage)}%;"></div>
                        </div>
                        <strong>${r.percentage}%</strong>
                      </div>
                    </td>
                    <td>
                      <span class="badge ${r.percentage >= 75 ? 'badge-success' : 'badge-danger'}">
                        ${r.percentage >= 75 ? 'Satisfactory' : 'Action Required (<75%)'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderParentAttendance() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const records = UniStorage.getStudentAttendance(student.id);

    return `
      <div class="alert-box alert-warning">
        <span style="font-size: 20px;">📢</span>
        <div>
          <strong>Important Notification to Parents:</strong>
          As per Nagarjuna University Academic Ordinance, students falling below 75% attendance are ineligible to appear for Semester End Examinations.
          Kindly monitor your ward's attendance regularly.
        </div>
      </div>

      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>📊</span> Complete Attendance Tracker - ${student.name} (${student.rollNo})
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Total Hours</th>
                  <th>Attended</th>
                  <th>Absent</th>
                  <th>Percentage</th>
                  <th>Exam Eligibility</th>
                </tr>
              </thead>
              <tbody>
                ${records.map(r => `
                  <tr>
                    <td><strong>${r.courseCode} - ${r.courseTitle}</strong></td>
                    <td>${r.totalHours} hrs</td>
                    <td><strong>${r.attendedHours} hrs</strong></td>
                    <td>${r.totalHours - r.attendedHours} hrs</td>
                    <td>
                      <div style="display:flex; align-items:center; gap: 8px;">
                        <div class="progress-bar-bg" style="width: 100px;">
                          <div class="progress-bar-fill ${r.percentage >= 75 ? 'progress-good' : 'progress-danger'}" style="width: ${Math.min(100, r.percentage)}%;"></div>
                        </div>
                        <strong>${r.percentage}%</strong>
                      </div>
                    </td>
                    <td>
                      <span class="badge ${r.percentage >= 75 ? 'badge-success' : 'badge-danger'}">
                        ${r.percentage >= 75 ? 'Eligible' : 'Needs Condonation'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderParentGrades() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const results = UniStorage.getStudentResults(student.id);

    return `
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>📜</span> Ward Academic Grade Sheet & Performance Record
          </div>
          <div class="badge badge-success" style="font-size: 13px;">Cumulative CGPA: ${student.cgpa} / 10.0</div>
        </div>
        <div class="card-body p-0">
          ${results && results.pastSemesters ? results.pastSemesters.map(sem => `
            <div style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>Semester ${sem.semester} (${sem.academicYear})</strong>
                <span style="margin-left: 10px; font-size: 12px; color: var(--text-muted);">${sem.totalCredits} Total Credits</span>
              </div>
              <div>
                <span class="badge badge-primary">SGPA: ${sem.sgpa}</span>
                <span class="badge badge-success">${sem.result}</span>
              </div>
            </div>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Title</th>
                    <th>Credits</th>
                    <th>Marks Scored</th>
                    <th>Letter Grade</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  ${sem.subjects.map(s => `
                    <tr>
                      <td><strong>${s.code}</strong></td>
                      <td>${s.title}</td>
                      <td>${s.credits}</td>
                      <td>${s.marks} / 100</td>
                      <td><span class="badge badge-success">${s.grade}</span></td>
                      <td><strong>${s.points}</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('') : '<div style="padding:20px;">No past semester results published yet.</div>'}
        </div>
      </div>
    `;
  }

  function renderParentFees() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const feeData = UniStorage.getStudentFees(student.id);

    return `
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>💳</span> Child Fee Details & Online Payment
          </div>
          <div style="font-size: 13px; font-weight: 600;">
            Pending Dues: <span style="color: var(--danger);">₹${feeData.totalPending.toLocaleString()}</span>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fee Description</th>
                  <th>Due Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${feeData.breakdown.map(item => `
                  <tr>
                    <td><strong>${item.feeType}</strong></td>
                    <td>${item.dueDate}</td>
                    <td><strong>₹${item.amount.toLocaleString()}</strong></td>
                    <td>
                      <span class="badge ${item.status === 'Paid' ? 'badge-success' : 'badge-danger'}">
                        ${item.status}
                      </span>
                    </td>
                    <td>
                      ${item.status === 'Paid' 
                        ? `<button class="btn-secondary btn-sm" onclick="UniApp.viewReceipt('${item.receiptNo}')">View Receipt</button>` 
                        : `<button class="btn-primary btn-sm" onclick="UniApp.openPayFeeModal('${item.id}', '${item.feeType}', ${item.amount - (item.paidAmount || 0)})">Pay Online (Parent)</button>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderParentMentor() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const faculty = UniStorage.getFacultyList()[0];

    return `
      <div class="grid-2">
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>👩‍🏫</span> Assigned Faculty Mentor Details
            </div>
          </div>
          <div class="card-body">
            <div style="display:flex; align-items:center; gap: 16px; margin-bottom: 20px;">
              <div class="profile-avatar-large" style="display:flex;align-items:center;justify-content:center;font-size:28px;background:#1e3a8a;color:#fff;">
                👩‍🏫
              </div>
              <div>
                <h3 style="font-size: 16px; font-weight: 700;">${faculty.name}</h3>
                <p style="font-size: 13px; color: var(--text-muted);">${faculty.designation}</p>
                <p style="font-size: 12px; color: var(--primary);">${faculty.department}</p>
              </div>
            </div>

            <div style="font-size: 13px; display:flex; flex-direction:column; gap: 10px; border-top: 1px solid var(--border-color); padding-top: 14px;">
              <div><strong>Email:</strong> ${faculty.email}</div>
              <div><strong>Phone:</strong> ${faculty.phone}</div>
              <div><strong>Office Location:</strong> ${faculty.office}</div>
              <div><strong>Parent Interaction Hours:</strong> Mon & Thu, 3:00 PM - 5:00 PM</div>
            </div>
          </div>
        </div>

        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>✉️</span> Send In-Portal Inquiry to Mentor
            </div>
          </div>
          <div class="card-body">
            <form onsubmit="UniApp.handleSendMentorMessage(event)">
              <div class="form-group">
                <label class="form-label">Subject</label>
                <input type="text" class="form-input" placeholder="e.g. Inquiry regarding Rahul's Midterm preparation" required>
              </div>
              <div class="form-group">
                <label class="form-label">Message to Mentor</label>
                <textarea class="form-input" rows="4" placeholder="Dear Dr. Anita, I would like to schedule a brief interaction regarding..." required></textarea>
              </div>
              <button type="submit" class="btn-primary">
                <span>📨</span> Send Inquiry to Mentor
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================
  // 4. ADMIN VIEW RENDERERS
  // =========================================================

  function renderAdminDashboard() {
    const students = UniStorage.getStudents();
    const faculty = UniStorage.getFacultyList();
    const courses = UniStorage.getCourses();
    const grievances = UniStorage.getGrievances();
    const pendingGrvs = grievances.filter(g => g.status !== 'Resolved');

    return `
      <!-- Admin KPI Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Total Registered Students</span>
            <span class="stat-value">${students.length}</span>
            <span class="stat-trend trend-positive">Across 4 Departments</span>
          </div>
          <div class="stat-icon-wrapper icon-blue">🎓</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Active Faculty Members</span>
            <span class="stat-value">${faculty.length}</span>
            <span class="stat-trend trend-positive">Average 12 Yrs Exp</span>
          </div>
          <div class="stat-icon-wrapper icon-green">👩‍🏫</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Course Catalog</span>
            <span class="stat-value">${courses.length} Subjects</span>
            <span class="stat-trend">Core & Electives CBCS</span>
          </div>
          <div class="stat-icon-wrapper icon-purple">📚</div>
        </div>

        <div class="stat-card">
          <div class="stat-info">
            <span class="stat-label">Open Grievances</span>
            <span class="stat-value" style="color: ${pendingGrvs.length > 0 ? 'var(--warning)' : 'var(--success)'};">
              ${pendingGrvs.length}
            </span>
            <span class="stat-trend ${pendingGrvs.length > 0 ? 'trend-warning' : 'trend-positive'}">
              ${pendingGrvs.length > 0 ? 'Requires Redressal' : 'All Clear'}
            </span>
          </div>
          <div class="stat-icon-wrapper icon-amber">📬</div>
        </div>
      </div>

      <!-- Quick Administration Shortcuts -->
      <div style="display:flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
        <button class="btn-primary" style="width: auto;" onclick="UniApp.openAddStudentModal()">
          <span>➕</span> Register New Student
        </button>
        <button class="btn-secondary" onclick="UniApp.openAddFacultyModal()">
          <span>➕</span> Add Faculty Member
        </button>
        <button class="btn-secondary" onclick="UniApp.openAddCourseModal()">
          <span>➕</span> Add New Course / Elective
        </button>
        <button class="btn-secondary" onclick="UniApp.navigate('admin-grievances')">
          <span>📬</span> Review Pending Grievances (${pendingGrvs.length})
        </button>
      </div>

      <!-- Overview Tables Split -->
      <div class="grid-2">
        <!-- Recent Student Registrations -->
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>🎓</span> Enrolled Students Overview
            </div>
            <button class="btn-secondary btn-sm" onclick="UniApp.navigate('admin-students')">Manage All</button>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${students.slice(0, 5).map(s => `
                    <tr>
                      <td><strong>${s.rollNo}</strong></td>
                      <td>${s.name}</td>
                      <td>${s.department}</td>
                      <td>
                        <span class="badge ${s.attendanceOverall >= 75 ? 'badge-success' : 'badge-danger'}">
                          ${s.attendanceOverall}%
                        </span>
                      </td>
                      <td><span class="badge badge-success">${s.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Pending Grievance Redressal Desk -->
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>📬</span> Urgent Grievances Requiring Action
            </div>
            <button class="btn-secondary btn-sm" onclick="UniApp.navigate('admin-grievances')">Open Desk</button>
          </div>
          <div class="card-body p-0">
            ${grievances.slice(0, 4).map(g => `
              <div class="notice-item" style="cursor: pointer;" onclick="UniApp.openResolveGrievanceModal('${g.id}')">
                <div class="notice-top">
                  <span class="badge ${g.status === 'Resolved' ? 'badge-success' : (g.status === 'Under Review' ? 'badge-info' : 'badge-warning')}">${g.status}</span>
                  <span style="font-size: 11px; color: var(--text-light);">${g.submittedDate}</span>
                </div>
                <div class="notice-title" style="font-size: 13px;">${g.title}</div>
                <div class="notice-body" style="font-size: 12px; margin-bottom: 4px;">Student: <strong>${g.studentName}</strong> (${g.department}) • Category: ${g.category}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderAdminStudents() {
    const students = UniStorage.getStudents();

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 18px; font-weight: 700; color: var(--dark-navy);">Student Administration Master Directory</h2>
          <p style="font-size: 12px; color: var(--text-muted);">Manage admissions, enrollment profiles, and academic standing</p>
        </div>
        <button class="btn-primary" style="width: auto;" onclick="UniApp.openAddStudentModal()">
          <span>➕</span> Register New Student
        </button>
      </div>

      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>🎓</span> Registered Students (${students.length})
          </div>
          <div class="search-input-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search student name or roll..." oninput="UniApp.filterStudentTable(this.value)">
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table" id="admin-students-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Department & Sem</th>
                  <th>Contact Email</th>
                  <th>Attendance %</th>
                  <th>CGPA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(s => `
                  <tr>
                    <td><strong>${s.rollNo}</strong></td>
                    <td><strong>${s.name}</strong></td>
                    <td>${s.department} (Sem ${s.semester})</td>
                    <td>${s.email}</td>
                    <td>
                      <span class="badge ${s.attendanceOverall >= 75 ? 'badge-success' : 'badge-danger'}">
                        ${s.attendanceOverall}%
                      </span>
                    </td>
                    <td><strong>${s.cgpa}</strong></td>
                    <td><span class="badge badge-success">${s.status}</span></td>
                    <td>
                      <div style="display:flex; gap: 6px;">
                        <button class="btn-secondary btn-sm" onclick="UniApp.viewStudentProfileModal('${s.id}')">View</button>
                        <button class="btn-danger btn-sm" onclick="UniApp.handleDeleteStudent('${s.id}', '${s.name}')">Delete</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderAdminFaculty() {
    const faculty = UniStorage.getFacultyList();

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 18px; font-weight: 700; color: var(--dark-navy);">Faculty Members & Academic Staff</h2>
          <p style="font-size: 12px; color: var(--text-muted);">Manage professor appointments, subject allocations, and departments</p>
        </div>
        <button class="btn-primary" style="width: auto;" onclick="UniApp.openAddFacultyModal()">
          <span>➕</span> Add Faculty Member
        </button>
      </div>

      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>👩‍🏫</span> Faculty Directory (${faculty.length})
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Name & Title</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Assigned Courses</th>
                  <th>Office</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                ${faculty.map(f => `
                  <tr>
                    <td><strong>${f.id}</strong></td>
                    <td><strong>${f.name}</strong><br><span style="font-size:11px;color:var(--text-muted);">${f.qualification}</span></td>
                    <td>${f.department}</td>
                    <td><span class="badge badge-primary">${f.designation}</span></td>
                    <td>${(f.assignedCourses || []).join(', ')}</td>
                    <td>${f.office}</td>
                    <td>${f.email}<br><span style="font-size:11px;color:var(--text-muted);">${f.phone}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderAdminCourses() {
    const courses = UniStorage.getCourses();

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 18px; font-weight: 700; color: var(--dark-navy);">Academic Course & Electives Catalog</h2>
          <p style="font-size: 12px; color: var(--text-muted);">Configure CBCS syllabus, credit values, seat capacity, and allocated faculty</p>
        </div>
        <button class="btn-primary" style="width: auto;" onclick="UniApp.openAddCourseModal()">
          <span>➕</span> Add New Course
        </button>
      </div>

      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>📚</span> University Curriculum Catalog (${courses.length} Courses)
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Credits</th>
                  <th>Instructor</th>
                  <th>Capacity / Enrolled</th>
                  <th>Timetable Schedule</th>
                </tr>
              </thead>
              <tbody>
                ${courses.map(c => `
                  <tr>
                    <td><strong>${c.code}</strong></td>
                    <td><strong>${c.title}</strong></td>
                    <td>${c.department}</td>
                    <td><span class="badge ${c.type === 'Core' ? 'badge-primary' : 'badge-info'}">${c.type}</span></td>
                    <td><strong>${c.credits} Credits</strong></td>
                    <td>${c.facultyName}</td>
                    <td>
                      <span class="badge ${c.enrolledCount >= c.maxCapacity ? 'badge-danger' : 'badge-success'}">
                        ${c.enrolledCount || 0} / ${c.maxCapacity} Seats
                      </span>
                    </td>
                    <td>${c.schedule} (${c.room})</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderAdminGrievances() {
    const grievances = UniStorage.getGrievances();

    return `
      <div class="content-card">
        <div class="card-header">
          <div class="card-title">
            <span>📬</span> University Grievance Redressal Desk (${grievances.length} Tickets)
          </div>
          <div style="display:flex; gap: 8px;">
            <button class="btn-secondary btn-sm" onclick="UniApp.filterGrievances('All')">All</button>
            <button class="btn-secondary btn-sm" onclick="UniApp.filterGrievances('Pending')">Pending</button>
            <button class="btn-secondary btn-sm" onclick="UniApp.filterGrievances('Resolved')">Resolved</button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table" id="admin-grievances-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Student Info</th>
                  <th>Category</th>
                  <th>Subject & Details</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${grievances.map(g => `
                  <tr data-status="${g.status}">
                    <td><strong>${g.id}</strong><br><span style="font-size:11px;color:var(--text-light);">${g.submittedDate}</span></td>
                    <td><strong>${g.studentName}</strong><br><span style="font-size:11px;color:var(--text-muted);">${g.studentId} (${g.department})</span></td>
                    <td><span class="badge badge-primary">${g.category}</span></td>
                    <td style="max-width: 300px;">
                      <strong>${g.title}</strong>
                      <p style="font-size: 12px; color: var(--text-muted); margin-top: 3px;">${g.description}</p>
                      ${g.adminNote ? `<div style="margin-top: 4px; font-size: 11px; background:#eff6ff; padding: 4px 8px; border-radius: 4px; color: var(--primary);"><strong>Official Note:</strong> ${g.adminNote}</div>` : ''}
                    </td>
                    <td>
                      <span class="badge ${g.priority === 'High' ? 'badge-danger' : 'badge-warning'}">${g.priority}</span>
                    </td>
                    <td>
                      <span class="badge ${g.status === 'Resolved' ? 'badge-success' : (g.status === 'Under Review' ? 'badge-info' : 'badge-warning')}">
                        ${g.status}
                      </span>
                    </td>
                    <td>
                      <button class="btn-primary btn-sm" onclick="UniApp.openResolveGrievanceModal('${g.id}')">
                        ${g.status === 'Resolved' ? 'Update Note' : 'Review & Resolve'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderAdminAnnouncements() {
    const announcements = UniStorage.getAnnouncements();

    return `
      <div class="grid-1-2">
        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>📢</span> Issue Official University Circular
            </div>
          </div>
          <div class="card-body">
            <form onsubmit="UniApp.handlePostAdminAnnouncement(event)">
              <div class="form-group">
                <label class="form-label">Circular Title</label>
                <input type="text" id="admin-ann-title" class="form-input" placeholder="e.g. Schedule of Annual Convocation 2026" required>
              </div>

              <div class="form-group">
                <label class="form-label">Category</label>
                <select id="admin-ann-category" class="form-input">
                  <option value="Administration">General Administration</option>
                  <option value="Examination">Examinations & Evaluation</option>
                  <option value="Academic">Academic Regulation</option>
                  <option value="Placement">Campus Placements</option>
                  <option value="Attendance">Attendance & Condonation</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Issuing Authority</label>
                <input type="text" id="admin-ann-author" class="form-input" value="Office of Registrar, Nagarjuna University" required>
              </div>

              <div class="form-group">
                <label class="form-label">Audience Scope</label>
                <select id="admin-ann-audience" class="form-input">
                  <option value="All Students & Faculty">All Students & Faculty</option>
                  <option value="All Students">All Students</option>
                  <option value="Faculty & Staff Only">Faculty & Staff Only</option>
                  <option value="Parents & Students">Parents & Students</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Circular Description</label>
                <textarea id="admin-ann-content" class="form-input" rows="4" placeholder="Enter full notification details..." required></textarea>
              </div>

              <div class="form-group">
                <label style="display:flex; align-items:center; gap: 8px; cursor: pointer;">
                  <input type="checkbox" id="admin-ann-urgent"> Mark as High Priority / Urgent Alert
                </label>
              </div>

              <button type="submit" class="btn-primary">
                <span>📡</span> Broadcast Circular
              </button>
            </form>
          </div>
        </div>

        <div class="content-card">
          <div class="card-header">
            <div class="card-title">
              <span>📋</span> Published Circulars Log
            </div>
          </div>
          <div class="card-body p-0">
            ${announcements.map(ann => `
              <div class="notice-item">
                <div class="notice-top">
                  <span class="badge ${ann.urgent ? 'badge-danger' : 'badge-primary'}">${ann.category}</span>
                  <span style="font-size: 11px; color: var(--text-light);">${ann.date}</span>
                </div>
                <div class="notice-title">${ann.title}</div>
                <div class="notice-body">${ann.content}</div>
                <div class="notice-meta">
                  <span>Issued By: ${ann.author}</span>
                  <span>Scope: ${ann.audience}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================
  // MODAL HANDLERS & ACTIONS
  // =========================================================

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  }

  // 1. Fee Payment Online Simulation Modal
  function openPayFeeModal(feeId, feeName, amount) {
    const modalTitle = document.getElementById('general-modal-title');
    const modalBody = document.getElementById('general-modal-body');
    const modalFooter = document.getElementById('general-modal-footer');

    modalTitle.innerHTML = `💳 Online Fee Payment`;
    modalBody.innerHTML = `
      <div style="background: #f8fafc; padding: 14px; border-radius: 8px; margin-bottom: 20px; border: 1px solid var(--border-color);">
        <div style="font-size: 12px; color: var(--text-muted);">Payment For:</div>
        <div style="font-size: 15px; font-weight: 700; color: var(--dark-navy);">${feeName}</div>
        <div style="font-size: 20px; font-weight: 800; color: var(--primary); margin-top: 6px;">Total Payable: ₹${amount.toLocaleString()}</div>
      </div>

      <form id="online-pay-form" onsubmit="UniApp.processFeePayment(event, '${feeId}')">
        <label class="form-label">Select Payment Gateway / Method</label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
          <label style="border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <input type="radio" name="pay_mode" value="UPI" checked>
            <span style="font-weight: 600; font-size: 12px;">Google Pay / UPI</span>
          </label>
          <label style="border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <input type="radio" name="pay_mode" value="Debit / Credit Card">
            <span style="font-weight: 600; font-size: 12px;">Debit / Credit Card</span>
          </label>
          <label style="border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <input type="radio" name="pay_mode" value="Net Banking">
            <span style="font-weight: 600; font-size: 12px;">Net Banking</span>
          </label>
        </div>

        <div class="form-group">
          <label class="form-label">Payer Account / UPI ID</label>
          <input type="text" class="form-input" placeholder="e.g. rahul.sharma@okaxis or Card Number" required value="rajesh.sharma@okhdfcbank">
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-secondary" onclick="UniApp.closeModal('general-modal')">Cancel</button>
          <button type="submit" class="btn-success" style="width: auto;">Authorize & Pay ₹${amount.toLocaleString()}</button>
        </div>
      </form>
    `;

    modalFooter.innerHTML = '';
    openModal('general-modal');
  }

  function processFeePayment(event, feeId) {
    if (event) event.preventDefault();
    const mode = document.querySelector('input[name="pay_mode"]:checked').value;
    const studentId = currentUser.role === 'parent' ? (currentUser.studentId || 'STU-2024-001') : (currentUser.studentId || 'STU-2024-001');

    const res = UniStorage.payFeeItem(studentId, feeId, mode);
    if (res.success) {
      closeModal('general-modal');
      showToast(res.message, 'success');
      // Show official receipt immediately!
      viewReceipt(res.receipt.receiptNo);
    } else {
      showToast(res.message, 'error');
    }
  }

  // 2. View / Print Fee Receipt
  function viewReceipt(receiptNo) {
    const studentId = currentUser.role === 'parent' ? (currentUser.studentId || 'STU-2024-001') : (currentUser.studentId || 'STU-2024-001');
    const feeData = UniStorage.getStudentFees(studentId);
    const student = UniStorage.getStudentById(studentId);

    let paymentRecord = null;
    let feeBreakdownItem = null;

    if (feeData) {
      paymentRecord = (feeData.paymentHistory || []).find(h => h.receiptNo === receiptNo);
      feeBreakdownItem = (feeData.breakdown || []).find(b => b.receiptNo === receiptNo);
    }

    const amount = paymentRecord ? paymentRecord.amount : (feeBreakdownItem ? feeBreakdownItem.amount : 65000);
    const description = paymentRecord ? paymentRecord.description : (feeBreakdownItem ? feeBreakdownItem.feeType : 'Tuition Fee - Semester VI');
    const date = paymentRecord ? paymentRecord.date : (feeBreakdownItem ? feeBreakdownItem.paymentDate : '2026-08-15');
    const mode = paymentRecord ? paymentRecord.paymentMode : (feeBreakdownItem ? feeBreakdownItem.mode : 'Online UPI');
    const txn = paymentRecord ? paymentRecord.transactionId : 'TXN-984712391';

    const container = document.getElementById('printable-receipt-content');
    container.innerHTML = `
      <div class="receipt-wrapper">
        <div class="receipt-watermark">PAID</div>
        
        <div class="receipt-header">
          <div class="receipt-seal">🏛️</div>
          <div class="receipt-univ">Nagarjuna University</div>
          <div class="receipt-sub">Autonomous Institution • Nagarjuna Nagar, Guntur, AP - 522510</div>
          <div style="font-size: 13px; font-weight: 700; margin-top: 8px; color: var(--primary);">OFFICIAL FEE PAYMENT RECEIPT</div>
        </div>

        <div class="receipt-meta-grid">
          <div><strong>Receipt Number:</strong> ${receiptNo}</div>
          <div><strong>Transaction ID:</strong> ${txn}</div>
          <div><strong>Student Name:</strong> ${student ? student.name : 'Rahul Sharma'}</div>
          <div><strong>Roll / Enrollment No:</strong> ${student ? student.rollNo : '21NU048'}</div>
          <div><strong>Department:</strong> ${student ? student.department : 'CSE'}</div>
          <div><strong>Semester / Academic Year:</strong> Semester VI (2026-2027)</div>
          <div><strong>Payment Date:</strong> ${date}</div>
          <div><strong>Payment Method:</strong> ${mode}</div>
        </div>

        <div style="margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 10px;">
          <div class="receipt-item-row" style="font-weight: 700; color: var(--text-muted); font-size: 12px;">
            <span>FEE HEAD DESCRIPTION</span>
            <span>AMOUNT CLEARED</span>
          </div>
          <div class="receipt-item-row" style="font-size: 14px;">
            <span>${description}</span>
            <span>₹${amount.toLocaleString()}</span>
          </div>
          <div class="receipt-total-row">
            <span>TOTAL AMOUNT PAID:</span>
            <span>₹${amount.toLocaleString()}</span>
          </div>
        </div>

        <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: var(--text-muted);">
          <div>
            * Computer-generated electronic receipt.<br>
            * Certified under Nagarjuna University Digital Accounts.
          </div>
          <div style="text-align: right;">
            <div style="font-family: cursive; font-size: 16px; color: var(--primary); font-weight: 700;">S.K. Narayana</div>
            <div style="border-top: 1px solid #94a3b8; padding-top: 4px; font-weight: 600;">Finance Officer / Registrar</div>
          </div>
        </div>
      </div>
    `;

    openModal('receipt-modal');
  }

  // 3. View / Print Examination Hall Ticket
  function openHallTicketModal() {
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const examSchedules = UniStorage.getExamSchedules();

    const container = document.getElementById('printable-hallticket-content');
    container.innerHTML = `
      <div class="receipt-wrapper">
        <div class="receipt-header">
          <div class="receipt-seal">🎓</div>
          <div class="receipt-univ">Nagarjuna University</div>
          <div class="receipt-sub">Office of the Controller of Examinations • B.Tech Regular Examinations</div>
          <div style="font-size: 14px; font-weight: 800; margin-top: 8px; color: var(--primary);">HALL TICKET / ADMIT CARD (NOV / DEC 2026)</div>
        </div>

        <div class="receipt-meta-grid">
          <div><strong>Candidate Name:</strong> ${student.name}</div>
          <div><strong>Registration / Roll No:</strong> ${student.rollNo}</div>
          <div><strong>Degree & Branch:</strong> B.Tech ${student.department}</div>
          <div><strong>Current Semester:</strong> Semester VI (Regular)</div>
          <div><strong>Attendance Verified:</strong> ${student.attendanceOverall}% (ELIGIBLE)</div>
          <div><strong>Center of Examination:</strong> Nagarjuna University Main Campus</div>
        </div>

        <div style="margin-top: 16px;">
          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; color: var(--dark-navy);">Scheduled Papers:</div>
          <table class="data-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Course Code & Title</th>
                <th>Hall & Desk</th>
                <th>Invigilator Sign</th>
              </tr>
            </thead>
            <tbody>
              ${examSchedules.map(e => `
                <tr>
                  <td><strong>${e.date}</strong></td>
                  <td>${e.time}</td>
                  <td><strong>${e.courseCode}</strong> - ${e.courseTitle}</td>
                  <td>${e.hall} (${e.seatNo})</td>
                  <td style="border-bottom: 1px dashed #cbd5e1; width: 100px;"></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 24px; font-size: 11px; color: var(--text-muted); line-height: 1.4;">
          <strong>Candidate Instructions:</strong><br>
          1. Entry to examination hall will not be permitted without this printed Hall Ticket and University Identity Card.<br>
          2. No electronic devices, programmable calculators, or smartwatches are permitted.<br>
          3. Candidates must be seated at least 15 minutes before exam commencement.
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px;">
          <div>
            <div style="width: 80px; height: 80px; border: 1px solid #cbd5e1; display:flex; align-items:center; justify-content:center; background:#f8fafc; font-size: 10px; color: #64748b;">
              Candidate Photo
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; color: var(--primary);">Dr. V. Ramanathan</div>
            <div style="border-top: 1px solid #94a3b8; padding-top: 2px;">Controller of Examinations</div>
          </div>
        </div>
      </div>
    `;

    openModal('hallticket-modal');
  }

  // 4. Course Registration & Drop
  function registerCourse(code) {
    const studentId = currentUser.studentId || 'STU-2024-001';
    const res = UniStorage.registerCourse(studentId, code);
    if (res.success) {
      showToast(res.message, 'success');
      navigate('student-courses');
    } else {
      showToast(res.message, 'error');
    }
  }

  function dropCourse(code) {
    const studentId = currentUser.studentId || 'STU-2024-001';
    if (confirm(`Are you sure you want to drop elective course ${code}?`)) {
      const res = UniStorage.dropCourse(studentId, code);
      if (res.success) {
        showToast(res.message, 'info');
        navigate('student-courses');
      } else {
        showToast(res.message, 'error');
      }
    }
  }

  // 5. Attendance Condonation Modal
  function openCondonationModal() {
    const modalTitle = document.getElementById('general-modal-title');
    const modalBody = document.getElementById('general-modal-body');
    const modalFooter = document.getElementById('general-modal-footer');

    modalTitle.innerHTML = `📝 Attendance Condonation & Medical Leave Application`;
    modalBody.innerHTML = `
      <form onsubmit="UniApp.handleSubmitCondonation(event)">
        <div class="form-group">
          <label class="form-label">Subject / Course Requiring Condonation</label>
          <select id="cond-course" class="form-input">
            <option value="CS604">CS604 - Advanced Database Systems (75.0%)</option>
            <option value="All Subjects">All Semester VI Courses</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Reason for Absence</label>
          <select id="cond-reason" class="form-input">
            <option value="Medical Emergency / Hospitalization">Medical Emergency / Hospitalization</option>
            <option value="Inter-University Sports / Technical Representation (OD)">Inter-University Technical Representation (OD)</option>
            <option value="Bereavement / Family Emergency">Family Emergency</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Dates of Absence</label>
          <input type="text" id="cond-dates" class="form-input" placeholder="e.g. 24th Oct 2026 to 28th Oct 2026" required value="24th Oct 2026 to 27th Oct 2026">
        </div>

        <div class="form-group">
          <label class="form-label">Explanation & Medical Summary</label>
          <textarea id="cond-desc" class="form-input" rows="3" placeholder="Provide details of physician certificate or on-duty approval..." required>Participated in University Smart India Hackathon Hackathon finals. OD form endorsed by HOD.</textarea>
        </div>

        <div style="display:flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-secondary" onclick="UniApp.closeModal('general-modal')">Cancel</button>
          <button type="submit" class="btn-primary" style="width: auto;">Submit Condonation Request</button>
        </div>
      </form>
    `;

    modalFooter.innerHTML = '';
    openModal('general-modal');
  }

  function handleSubmitCondonation(event) {
    if (event) event.preventDefault();
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');
    const course = document.getElementById('cond-course').value;
    const reason = document.getElementById('cond-reason').value;
    const desc = document.getElementById('cond-desc').value;

    UniStorage.createGrievance({
      studentId: student.id,
      studentName: student.name,
      department: student.department,
      category: 'Attendance & Medical Leave',
      title: `Attendance Condonation Application - ${course}`,
      description: `[${reason}] ${desc}`,
      priority: 'High'
    });

    closeModal('general-modal');
    showToast('Condonation application filed! Ticket assigned to Academic Dean.', 'success');
    navigate('student-grievance');
  }

  // 6. Grievance Lodging Modal
  function openSubmitGrievanceModal() {
    const modalTitle = document.getElementById('general-modal-title');
    const modalBody = document.getElementById('general-modal-body');
    const modalFooter = document.getElementById('general-modal-footer');

    modalTitle.innerHTML = `➕ Submit Grievance / Complaint`;
    modalBody.innerHTML = `
      <form onsubmit="UniApp.handleSubmitGrievance(event)">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select id="grv-cat" class="form-input">
            <option value="Academic & Curriculum">Academic & Curriculum</option>
            <option value="Infrastructure">Campus Infrastructure & Facilities</option>
            <option value="Examination & Marks">Examination & Marks</option>
            <option value="Attendance & Medical Leave">Attendance & Medical Leave</option>
            <option value="Hostel & Mess">Hostel & Mess Facilities</option>
            <option value="General Administration">General Administration</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Subject / Title</label>
          <input type="text" id="grv-title" class="form-input" placeholder="Brief summary of your complaint" required>
        </div>

        <div class="form-group">
          <label class="form-label">Detailed Description</label>
          <textarea id="grv-desc" class="form-input" rows="4" placeholder="Explain the problem clearly including date and location..." required></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Urgency Priority</label>
          <select id="grv-priority" class="form-input">
            <option value="Low">Low - Informational</option>
            <option value="Medium" selected>Medium - Normal Processing</option>
            <option value="High">High - Urgent Attention Required</option>
          </select>
        </div>

        <div style="display:flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-secondary" onclick="UniApp.closeModal('general-modal')">Cancel</button>
          <button type="submit" class="btn-primary" style="width: auto;">Submit Grievance Ticket</button>
        </div>
      </form>
    `;

    modalFooter.innerHTML = '';
    openModal('general-modal');
  }

  function handleSubmitGrievance(event) {
    if (event) event.preventDefault();
    const student = UniStorage.getStudentById(currentUser.studentId || 'STU-2024-001');

    const cat = document.getElementById('grv-cat').value;
    const title = document.getElementById('grv-title').value;
    const desc = document.getElementById('grv-desc').value;
    const priority = document.getElementById('grv-priority').value;

    const res = UniStorage.createGrievance({
      studentId: student.id,
      studentName: student.name,
      department: student.department,
      category: cat,
      title,
      description: desc,
      priority
    });

    closeModal('general-modal');
    showToast(res.message, 'success');
    navigate('student-grievance');
  }

  // 7. Faculty Attendance Actions
  function setAllAttendanceStatus(status) {
    const inputs = document.querySelectorAll('#attendance-roster-tbody input[type="radio"]');
    inputs.forEach(input => {
      if (input.value === status) {
        input.checked = true;
      }
    });
  }

  function handleSaveAttendance(event) {
    if (event) event.preventDefault();
    const courseCode = document.getElementById('att-course-select').value;
    const date = document.getElementById('att-date-input').value;
    const topic = document.getElementById('att-topic-input').value;
    const facultyId = currentUser.facultyId || 'FAC-101';

    const students = UniStorage.getStudents();
    const recordsMap = {};

    students.forEach(s => {
      const checkedRadio = document.querySelector(`input[name="att_status_${s.id}"]:checked`);
      recordsMap[s.id] = checkedRadio ? checkedRadio.value : 'Present';
    });

    const res = UniStorage.saveFacultyAttendance(courseCode, date, topic, recordsMap, facultyId);
    showToast(res.message, 'success');
    navigate('faculty-attendance');
  }

  function quickTakeAttendance(courseCode) {
    navigate('faculty-attendance');
    setTimeout(() => {
      const select = document.getElementById('att-course-select');
      if (select) {
        select.value = courseCode;
        reloadAttendanceRoster(courseCode);
      }
    }, 50);
  }

  function reloadAttendanceRoster(courseCode) {
    showToast(`Loaded roster for ${courseCode}.`, 'info');
  }

  // 8. Faculty Marks Entry Actions
  function quickEnterMarks(courseCode) {
    navigate('faculty-marks');
    setTimeout(() => {
      const select = document.getElementById('marks-course-select');
      if (select) {
        select.value = courseCode;
        reloadMarksTable(courseCode);
      }
    }, 50);
  }

  function reloadMarksTable(courseCode) {
    const marksData = UniStorage.getFacultyMarks(courseCode);
    const tbody = document.getElementById('marks-table-tbody');
    if (!tbody) return;

    if (!marksData || marksData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px;">No students enrolled for ${courseCode} yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = marksData.map((m, idx) => `
      <tr>
        <td><strong>${m.rollNo}</strong><input type="hidden" name="studentId_${idx}" value="${m.studentId}"></td>
        <td>${m.studentName}</td>
        <td>
          <input type="number" name="test1_${idx}" class="form-input" min="0" max="30" value="${m.test1}" style="width: 80px;" oninput="UniApp.recalcRowTotal(${idx})">
        </td>
        <td>
          <input type="number" name="test2_${idx}" class="form-input" min="0" max="30" value="${m.test2}" style="width: 80px;" oninput="UniApp.recalcRowTotal(${idx})">
        </td>
        <td>
          <input type="number" name="assign_${idx}" class="form-input" min="0" max="10" value="${m.assignment}" style="width: 80px;" oninput="UniApp.recalcRowTotal(${idx})">
        </td>
        <td>
          <strong id="total_marks_${idx}">${m.test1 + m.test2 + m.assignment} / 70</strong>
        </td>
        <td>
          <span class="badge badge-success" id="grade_badge_${idx}">${m.grade}</span>
        </td>
      </tr>
    `).join('');
  }

  function recalcRowTotal(idx) {
    const t1 = Number(document.querySelector(`input[name="test1_${idx}"]`).value) || 0;
    const t2 = Number(document.querySelector(`input[name="test2_${idx}"]`).value) || 0;
    const ass = Number(document.querySelector(`input[name="assign_${idx}"]`).value) || 0;

    const total = t1 + t2 + ass;
    const totalEl = document.getElementById(`total_marks_${idx}`);
    if (totalEl) totalEl.innerText = `${total} / 70`;

    let grade = 'F';
    if (total >= 60) grade = 'O';
    else if (total >= 50) grade = 'A+';
    else if (total >= 42) grade = 'A';
    else if (total >= 35) grade = 'B';
    else if (total >= 28) grade = 'C';

    const gradeEl = document.getElementById(`grade_badge_${idx}`);
    if (gradeEl) {
      gradeEl.innerText = grade;
      gradeEl.className = `badge ${total >= 35 ? 'badge-success' : 'badge-danger'}`;
    }
  }

  function handleSaveMarks(event) {
    if (event) event.preventDefault();
    const courseCode = document.getElementById('marks-course-select').value;
    const existing = UniStorage.getFacultyMarks(courseCode);

    const updatedList = existing.map((item, idx) => {
      const t1 = Number(document.querySelector(`input[name="test1_${idx}"]`).value) || 0;
      const t2 = Number(document.querySelector(`input[name="test2_${idx}"]`).value) || 0;
      const ass = Number(document.querySelector(`input[name="assign_${idx}"]`).value) || 0;
      const total = t1 + t2 + ass;

      let grade = 'F';
      if (total >= 60) grade = 'O';
      else if (total >= 50) grade = 'A+';
      else if (total >= 42) grade = 'A';
      else if (total >= 35) grade = 'B';
      else if (total >= 28) grade = 'C';

      return {
        ...item,
        test1: t1,
        test2: t2,
        assignment: ass,
        grade
      };
    });

    const res = UniStorage.saveFacultyMarks(courseCode, updatedList);
    showToast(res.message, 'success');
  }

  // 9. Faculty / Admin Announcement Handlers
  function handlePostAnnouncement(event) {
    if (event) event.preventDefault();
    const title = document.getElementById('ann-title').value;
    const category = document.getElementById('ann-category').value;
    const audience = document.getElementById('ann-audience').value;
    const content = document.getElementById('ann-content').value;
    const urgent = document.getElementById('ann-urgent').checked;

    const res = UniStorage.addAnnouncement({
      title,
      category,
      audience,
      content,
      author: currentUser.name,
      urgent
    });

    showToast(res.message, 'success');
    navigate('faculty-announcements');
  }

  function handlePostAdminAnnouncement(event) {
    if (event) event.preventDefault();
    const title = document.getElementById('admin-ann-title').value;
    const category = document.getElementById('admin-ann-category').value;
    const author = document.getElementById('admin-ann-author').value;
    const audience = document.getElementById('admin-ann-audience').value;
    const content = document.getElementById('admin-ann-content').value;
    const urgent = document.getElementById('admin-ann-urgent').checked;

    const res = UniStorage.addAnnouncement({
      title,
      category,
      author,
      audience,
      content,
      urgent
    });

    showToast(res.message, 'success');
    navigate('admin-announcements');
  }

  // 10. Admin Student Management Modals
  function openAddStudentModal() {
    const modalTitle = document.getElementById('general-modal-title');
    const modalBody = document.getElementById('general-modal-body');
    const modalFooter = document.getElementById('general-modal-footer');

    modalTitle.innerHTML = `➕ Register New Student`;
    modalBody.innerHTML = `
      <form onsubmit="UniApp.handleCreateStudent(event)">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="new-stu-name" class="form-input" placeholder="e.g. Aditi Rao" required>
          </div>
          <div class="form-group">
            <label class="form-label">Roll Number</label>
            <input type="text" id="new-stu-roll" class="form-input" placeholder="e.g. 21NU054" required>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="new-stu-email" class="form-input" placeholder="aditi.rao@uniconnect.edu" required>
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="tel" id="new-stu-phone" class="form-input" placeholder="+91 98765 12345" required>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Department</label>
            <select id="new-stu-dept" class="form-input">
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Semester</label>
            <select id="new-stu-sem" class="form-input">
              <option value="6">Semester VI</option>
              <option value="4">Semester IV</option>
            </select>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Parent Name</label>
            <input type="text" id="new-stu-parent" class="form-input" placeholder="Father or Mother Name" required>
          </div>
          <div class="form-group">
            <label class="form-label">Parent Contact</label>
            <input type="tel" id="new-stu-parent-phone" class="form-input" placeholder="+91 98765 54321" required>
          </div>
        </div>

        <div style="display:flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-secondary" onclick="UniApp.closeModal('general-modal')">Cancel</button>
          <button type="submit" class="btn-primary" style="width: auto;">Complete Enrollment</button>
        </div>
      </form>
    `;

    modalFooter.innerHTML = '';
    openModal('general-modal');
  }

  function handleCreateStudent(event) {
    if (event) event.preventDefault();
    const name = document.getElementById('new-stu-name').value;
    const rollNo = document.getElementById('new-stu-roll').value;
    const email = document.getElementById('new-stu-email').value;
    const phone = document.getElementById('new-stu-phone').value;
    const department = document.getElementById('new-stu-dept').value;
    const semester = Number(document.getElementById('new-stu-sem').value);
    const parentName = document.getElementById('new-stu-parent').value;
    const parentPhone = document.getElementById('new-stu-parent-phone').value;

    UniStorage.addStudent({
      name,
      rollNo,
      email,
      phone,
      department,
      semester,
      section: 'A',
      parentName,
      parentPhone,
      mentor: 'Dr. Anita Roy',
      attendanceOverall: 85.0,
      cgpa: 8.20
    });

    closeModal('general-modal');
    showToast(`Student ${name} (${rollNo}) registered successfully!`, 'success');
    navigate('admin-students');
  }

  function handleDeleteStudent(id, name) {
    if (confirm(`Are you sure you want to delete student ${name} (${id})?`)) {
      UniStorage.deleteStudent(id);
      showToast(`Student ${name} removed from registry.`, 'info');
      navigate('admin-students');
    }
  }

  function viewStudentProfileModal(studentId) {
    const s = UniStorage.getStudentById(studentId);
    if (!s) return;

    const modalTitle = document.getElementById('general-modal-title');
    const modalBody = document.getElementById('general-modal-body');
    const modalFooter = document.getElementById('general-modal-footer');

    modalTitle.innerHTML = `🎓 Student Dossier: ${s.name}`;
    modalBody.innerHTML = `
      <div style="display:flex; align-items:center; gap: 16px; margin-bottom: 20px;">
        <div class="profile-avatar-large" style="display:flex;align-items:center;justify-content:center;font-size:28px;background:#1e3a8a;color:#fff;">
          🎓
        </div>
        <div>
          <h3 style="font-size: 16px; font-weight: 700;">${s.name}</h3>
          <p style="font-size: 13px; color: var(--text-muted);">${s.rollNo} • ${s.department}</p>
          <p style="font-size: 12px; color: var(--primary);">Semester ${s.semester} (Section ${s.section})</p>
        </div>
      </div>

      <div class="receipt-meta-grid" style="border-top: 1px solid var(--border-color); padding-top: 14px;">
        <div><strong>Official Email:</strong> ${s.email}</div>
        <div><strong>Student Phone:</strong> ${s.phone}</div>
        <div><strong>Cumulative CGPA:</strong> ${s.cgpa}</div>
        <div><strong>Attendance Percentage:</strong> ${s.attendanceOverall}%</div>
        <div><strong>Parent / Guardian:</strong> ${s.parentName}</div>
        <div><strong>Parent Phone:</strong> ${s.parentPhone}</div>
        <div><strong>Academic Mentor:</strong> ${s.mentor}</div>
        <div><strong>Status:</strong> <span class="badge badge-success">${s.status}</span></div>
      </div>
    `;

    modalFooter.innerHTML = `<button class="btn-secondary" onclick="UniApp.closeModal('general-modal')">Close</button>`;
    openModal('general-modal');
  }

  // 11. Admin Faculty & Course Creation
  function openAddFacultyModal() {
    const modalTitle = document.getElementById('general-modal-title');
    const modalBody = document.getElementById('general-modal-body');
    const modalFooter = document.getElementById('general-modal-footer');

    modalTitle.innerHTML = `➕ Add New Faculty Member`;
    modalBody.innerHTML = `
      <form onsubmit="UniApp.handleCreateFaculty(event)">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Faculty Full Name</label>
            <input type="text" id="new-fac-name" class="form-input" placeholder="e.g. Dr. K. Venkataraman" required>
          </div>
          <div class="form-group">
            <label class="form-label">Official Email</label>
            <input type="email" id="new-fac-email" class="form-input" placeholder="venkat@uniconnect.edu" required>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Department</label>
            <select id="new-fac-dept" class="form-input">
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mathematics & Computing">Mathematics & Computing</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Designation</label>
            <select id="new-fac-desig" class="form-input">
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
            </select>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Qualification</label>
            <input type="text" id="new-fac-qual" class="form-input" placeholder="e.g. Ph.D (IIT Madras)" required>
          </div>
          <div class="form-group">
            <label class="form-label">Office Location</label>
            <input type="text" id="new-fac-office" class="form-input" placeholder="e.g. CS Block Room 405" required>
          </div>
        </div>

        <div style="display:flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-secondary" onclick="UniApp.closeModal('general-modal')">Cancel</button>
          <button type="submit" class="btn-primary" style="width: auto;">Add Faculty</button>
        </div>
      </form>
    `;

    modalFooter.innerHTML = '';
    openModal('general-modal');
  }

  function handleCreateFaculty(event) {
    if (event) event.preventDefault();
    const name = document.getElementById('new-fac-name').value;
    const email = document.getElementById('new-fac-email').value;
    const department = document.getElementById('new-fac-dept').value;
    const designation = document.getElementById('new-fac-desig').value;
    const qualification = document.getElementById('new-fac-qual').value;
    const office = document.getElementById('new-fac-office').value;

    UniStorage.addFaculty({
      name,
      email,
      phone: '+91 98111 88990',
      department,
      designation,
      qualification,
      office,
      experience: '10 Years',
      assignedCourses: []
    });

    closeModal('general-modal');
    showToast(`Faculty member ${name} added!`, 'success');
    navigate('admin-faculty');
  }

  function openAddCourseModal() {
    const modalTitle = document.getElementById('general-modal-title');
    const modalBody = document.getElementById('general-modal-body');
    const modalFooter = document.getElementById('general-modal-footer');
    const faculty = UniStorage.getFacultyList();

    modalTitle.innerHTML = `➕ Add Course / Elective`;
    modalBody.innerHTML = `
      <form onsubmit="UniApp.handleCreateCourse(event)">
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Course Code</label>
            <input type="text" id="new-crs-code" class="form-input" placeholder="e.g. CS607" required>
          </div>
          <div class="form-group">
            <label class="form-label">Course Title</label>
            <input type="text" id="new-crs-title" class="form-input" placeholder="e.g. Quantum Computing Foundations" required>
          </div>
        </div>

        <div class="grid-3">
          <div class="form-group">
            <label class="form-label">Course Type</label>
            <select id="new-crs-type" class="form-input">
              <option value="Elective">Department Elective</option>
              <option value="Open Elective">Open Elective (Interdisciplinary)</option>
              <option value="Core">Core Mandatory</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Credits</label>
            <input type="number" id="new-crs-credits" class="form-input" value="3" min="1" max="6" required>
          </div>
          <div class="form-group">
            <label class="form-label">Seat Capacity</label>
            <input type="number" id="new-crs-capacity" class="form-input" value="50" min="10" max="120" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Instructor</label>
          <select id="new-crs-faculty" class="form-input">
            ${faculty.map(f => `<option value="${f.name}">${f.name} (${f.department})</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Description & Syllabus</label>
          <textarea id="new-crs-desc" class="form-input" rows="3" placeholder="Overview of topics and learning objectives..." required></textarea>
        </div>

        <div style="display:flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-secondary" onclick="UniApp.closeModal('general-modal')">Cancel</button>
          <button type="submit" class="btn-primary" style="width: auto;">Create Course</button>
        </div>
      </form>
    `;

    modalFooter.innerHTML = '';
    openModal('general-modal');
  }

  function handleCreateCourse(event) {
    if (event) event.preventDefault();
    const code = document.getElementById('new-crs-code').value.toUpperCase();
    const title = document.getElementById('new-crs-title').value;
    const type = document.getElementById('new-crs-type').value;
    const credits = Number(document.getElementById('new-crs-credits').value);
    const maxCapacity = Number(document.getElementById('new-crs-capacity').value);
    const facultyName = document.getElementById('new-crs-faculty').value;
    const desc = document.getElementById('new-crs-desc').value;

    UniStorage.addCourse({
      code,
      title,
      department: 'CSE',
      type,
      credits,
      semester: 6,
      facultyName,
      schedule: 'Tue, Thu 02:00 PM - 03:30 PM',
      room: 'LH-301',
      maxCapacity,
      enrolledCount: 0,
      syllabus: desc.substring(0, 80),
      description: desc
    });

    closeModal('general-modal');
    showToast(`Course ${code} added to academic curriculum!`, 'success');
    navigate('admin-courses');
  }

  // 12. Admin Grievance Resolution
  function openResolveGrievanceModal(grievanceId) {
    const list = UniStorage.getGrievances();
    const g = list.find(item => item.id === grievanceId);
    if (!g) return;

    const modalTitle = document.getElementById('general-modal-title');
    const modalBody = document.getElementById('general-modal-body');
    const modalFooter = document.getElementById('general-modal-footer');

    modalTitle.innerHTML = `📬 Redressal Action: Ticket #${g.id}`;
    modalBody.innerHTML = `
      <div style="background: #f8fafc; padding: 14px; border-radius: 8px; margin-bottom: 20px; border: 1px solid var(--border-color);">
        <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
          <span class="badge badge-primary">${g.category}</span>
          <span style="font-size: 11px; color: var(--text-light);">${g.submittedDate}</span>
        </div>
        <div style="font-size: 15px; font-weight: 700; color: var(--dark-navy);">${g.title}</div>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">${g.description}</p>
        <div style="font-size: 12px; margin-top: 8px; color: var(--primary);">
          Filed by: <strong>${g.studentName}</strong> (${g.studentId} • ${g.department})
        </div>
      </div>

      <form onsubmit="UniApp.handleSaveGrievanceResolution(event, '${g.id}')">
        <div class="form-group">
          <label class="form-label">Update Ticket Status</label>
          <select id="resolve-status" class="form-input">
            <option value="Under Review" ${g.status === 'Under Review' ? 'selected' : ''}>Under Review (Action in progress)</option>
            <option value="Resolved" ${g.status === 'Resolved' ? 'selected' : ''}>Resolved (Issue addressed)</option>
            <option value="Pending" ${g.status === 'Pending' ? 'selected' : ''}>Pending</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Official Administrative Resolution / Remarks</label>
          <textarea id="resolve-note" class="form-input" rows="4" placeholder="Enter findings, corrective action taken, or instructions to student..." required>${g.adminNote || ''}</textarea>
        </div>

        <div style="display:flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn-secondary" onclick="UniApp.closeModal('general-modal')">Cancel</button>
          <button type="submit" class="btn-primary" style="width: auto;">Submit Official Redressal</button>
        </div>
      </form>
    `;

    modalFooter.innerHTML = '';
    openModal('general-modal');
  }

  function handleSaveGrievanceResolution(event, grievanceId) {
    if (event) event.preventDefault();
    const status = document.getElementById('resolve-status').value;
    const note = document.getElementById('resolve-note').value;
    const resolvedBy = currentUser.name;

    const res = UniStorage.updateGrievance(grievanceId, status, note, resolvedBy);
    closeModal('general-modal');
    showToast(res.message, 'success');
    navigate('admin-grievances');
  }

  function filterGrievances(filter) {
    const rows = document.querySelectorAll('#admin-grievances-table tbody tr');
    rows.forEach(r => {
      const status = r.getAttribute('data-status');
      if (filter === 'All' || status === filter) {
        r.style.display = '';
      } else {
        r.style.display = 'none';
      }
    });
  }

  function filterStudentTable(query) {
    const term = (query || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#faculty-students-table tbody tr, #admin-students-table tbody tr');
    rows.forEach(r => {
      const text = r.innerText.toLowerCase();
      if (!term || text.includes(term)) {
        r.style.display = '';
      } else {
        r.style.display = 'none';
      }
    });
  }

  function handleSendMentorMessage(event) {
    if (event) event.preventDefault();
    showToast('Your message has been sent to Dr. Anita Roy. A notification was logged.', 'success');
  }

  // =========================================================
  // TOAST NOTIFICATION UTILITIES
  // =========================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  function attachViewEvents(viewId) {
    // Placeholder for any specific post-render listeners if needed
  }

  // Self Init
  window.addEventListener('DOMContentLoaded', init);

  return {
    init,
    fillDemoLogin,
    togglePasswordVisibility,
    handleLoginSubmit,
    logout,
    switchRole,
    resetDemoData,
    navigate,
    openAnnouncements,
    toggleMobileSidebar,
    closeMobileSidebar,
    openModal,
    closeModal,
    openPayFeeModal,
    processFeePayment,
    viewReceipt,
    openHallTicketModal,
    registerCourse,
    dropCourse,
    openCondonationModal,
    handleSubmitCondonation,
    openSubmitGrievanceModal,
    handleSubmitGrievance,
    setAllAttendanceStatus,
    handleSaveAttendance,
    quickTakeAttendance,
    reloadAttendanceRoster,
    quickEnterMarks,
    reloadMarksTable,
    recalcRowTotal,
    handleSaveMarks,
    handlePostAnnouncement,
    handlePostAdminAnnouncement,
    openAddStudentModal,
    handleCreateStudent,
    handleDeleteStudent,
    viewStudentProfileModal,
    openAddFacultyModal,
    handleCreateFaculty,
    openAddCourseModal,
    handleCreateCourse,
    openResolveGrievanceModal,
    handleSaveGrievanceResolution,
    filterGrievances,
    filterStudentTable,
    handleSendMentorMessage
  };
})();

// Export to window
if (typeof window !== 'undefined') {
  window.UniApp = UniApp;
}

