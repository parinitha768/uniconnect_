# UniConnect — Intelligent University Management Portal
### Developed for Nagarjuna University

A modern, responsive, and user-friendly university management web portal built using HTML5, CSS3, and JavaScript (ES6+). UniConnect automates academic and administrative activities across four major stakeholder roles: **Students**, **Faculty**, **Parents**, and **Administrators**.

---

## 🚀 Key Features Overview

### 1. Multi-Role Authentication & Quick Demo Logins
- Dedicated login tabs for **Students**, **Faculty**, **Parents**, and **Administrators**.
- **1-Click Demo Login** shortcuts to instantly auto-fill credentials for demonstration.
- In-portal role switcher in the top navigation bar to seamlessly preview the portal from different user perspectives.

### 2. Student Dashboard
- **Profile Summary:** Displays student name, roll number (21NU048), department, semester, section, and faculty mentor.
- **Academic KPIs:** Real-time Overall Attendance percentage, CGPA / SGPA display, registered credits counter, and pending fee status.
- **Alerts & Warnings:** Automated warning banners if attendance in any course drops below the mandatory 75% threshold.
- **Enrolled Courses Snapshot:** Visual progress bars indicating class attendance per subject and exam eligibility.

### 3. Faculty Dashboard & Academic Management
- **Teaching Allocation:** View assigned courses (e.g., CS601 Web Engineering, CS602 Cloud Computing) with schedules, classrooms, and enrollment counts.
- **Attendance Management:** Interactive class roster where faculty select course & date, toggle student statuses (Present / Absent / Late OD), and click **"Mark All Present"** for fast entry. Cumulative attendance and percentages update automatically.
- **Continuous Internal Evaluation (CIE) Marks Entry:** Enter Test 1, Test 2, and assignment marks with auto-calculated total and letter grades (O, A+, A, B, C, F).
- **Faculty Announcements:** Post subject notices, lab updates, and urgent circulars directly to student feeds.

### 4. Flexible Credit-Based Academic System (CBCS) & Electives
- **Credit Tracking:** Real-time calculation of registered credits against the semester cap (Minimum 18 credits, Maximum 24 credits).
- **Course Catalog:** View core mandatory subjects and explore specialized electives (e.g., Cloud Computing, AI & Machine Learning, Cyber Security, Mobile Flutter Architecture).
- **Seat Availability & 1-Click Enrollment:** Register or drop electives with automatic seat capacity decrement/increment.

### 5. Examination Management & Hall Tickets
- **Examination Timetable:** Displays scheduled dates, exam types, timings, exam halls, and desk allocations.
- **Official Hall Ticket / Admit Card:** Generate and print official examination hall tickets with candidate photo placeholder and Controller of Examinations endorsement.
- **Internal & Semester Results:** View Continuous Internal Evaluation (CIE) marks and published past-semester grade sheets with SGPA/CGPA breakdowns.

### 6. Fee Management & Digital Receipts
- **Fee Breakdown:** Clear status of semester tuition fees, lab fees, library access, and hostel/mess dues.
- **Simulated Online Payment Gateway:** Pay pending dues via UPI (Google Pay / PhonePe), Debit/Credit Card, or Net Banking.
- **Printable University Receipt:** Instant generation of official electronic fee payment receipts with watermark, receipt number, transaction ID, and Registrar signature.

### 7. Student Grievance Redressal Portal
- **Complaint Lodging:** Submit grievances across categories: *Academic & Curriculum*, *Infrastructure*, *Examination & Marks*, *Attendance Condonation*, and *Hostel/Mess*.
- **Priority & Tracking:** Mark complaints as Low, Medium, or High priority; track status through *Pending*, *Under Review*, and *Resolved*.
- **Administrative Redressal:** Administrators review tickets and append official resolution notes and timestamps.

### 8. Parent Dashboard & Ward Monitoring
- **Ward Academic Tracker:** Parents view child's overall attendance, CGPA, semester grade cards, and fee dues.
- **Low Attendance Warning:** Highlighted notices for courses falling below university eligibility requirements.
- **Fee Clearance by Parent:** Direct payment option for parents to clear pending dues online.
- **Faculty Advisor Connect:** Direct inquiry channel to the student's assigned mentor.

### 9. Administrator Hub & Master Records
- **Executive Analytics:** High-level metrics on student strength, faculty roster, active courses, fee collection rate, and open grievance tickets.
- **Student Master Directory:** Searchable table with options to add new students, inspect student dossiers, or delete records.
- **Faculty Directory:** Department-wise faculty roster with contact info and teaching workloads.
- **Course Catalog Management:** Add new core courses or interdisciplinary open electives with syllabus descriptions.
- **Grievance Desk:** Central queue to resolve student issues with official administrative remarks.
- **Campus Circular Broadcast:** Publish university-wide notifications with high-priority urgent tags.

---

## 🎨 Design & UI Highlights

- **Color Theme:** Academic Blue & White palette (`#1e40af`, `#2563eb`, `#eff6ff`, `#f8fafc`, `#ffffff`) with emerald green for success, amber for warnings, and rose for critical alerts.
- **Navigation:** Modern slate navy sidebar with active states, icons, and quick-access badges.
- **Responsive Layout:** CSS Grid & Flexbox architecture with mobile drawer toggle and hamburger menu.
- **Clean Components:** Modern stat cards, data tables with status badges, progress bars, interactive modal dialogs, and toast notifications.
- **Print Stylesheets:** Dedicated `@media print` rules ensuring clean, professional output for Fee Receipts and Examination Hall Tickets.

---

## 🔑 Demo Login Credentials

For demonstration, use any of the pre-configured accounts or click the **1-Click Demo Login** buttons on the login screen:

| Role | Email | Password | Demo Persona |
| :--- | :--- | :--- | :--- |
| **Student** | `student@uniconnect.edu` | `student123` | Rahul Sharma (B.Tech CSE, 6th Sem, 84.2% Attendance) |
| **Faculty** | `faculty@uniconnect.edu` | `faculty123` | Dr. Anita Roy (HOD & Professor, CSE) |
| **Parent** | `parent@uniconnect.edu` | `parent123` | Mr. Rajesh Sharma (Parent of Rahul Sharma) |
| **Administrator** | `admin@uniconnect.edu` | `admin123` | Dr. S. K. Narayana (Registrar & Chief Administrator) |

> **Pro-Tip:** Once logged in, you can also use the **"Switch View"** dropdown in the top header to preview different dashboards in one click without logging out.

---

## 🛠️ How to Run the Website

### Option 1: Direct File Launch (No server installation required)
Simply navigate to the project directory and double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Option 2: Run via Local Python Web Server
Open PowerShell or your terminal in the `software_project` directory and run:
```bash
python -m http.server 8000
```
Then open your web browser and navigate to:
```
http://localhost:8000
```

---

## 💾 Data Persistence & Reset

- All modifications (marking attendance, publishing marks, registering electives, paying fees, lodging grievances, adding students) persist in the browser's `localStorage`.
- To restore the fresh, pre-seeded dataset at any time, click the **"Reset Data"** button in the top navigation bar.

---

## 📂 Project Structure

```
software_project/
├── index.html          # Main portal application structure & dialogs
├── css/
│   └── styles.css      # Academic blue & white theme, responsive styles, print layouts
├── js/
│   ├── data.js         # Comprehensive pre-seeded realistic university data
│   ├── storage.js      # LocalStorage persistence & CRUD abstraction layer
│   └── app.js          # Role routing, dashboard rendering, and user interactions
├── README.md           # Documentation & user guide
└── CCE1.docx           # Case study reference document
```

