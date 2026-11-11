// UniConnect - Initial Mock & Seed Data
// Nagarjuna University Management Portal

const UniConnectSeed = {
  users: [
    {
      id: 'usr_student',
      role: 'student',
      name: 'Rahul Sharma',
      email: 'student@uniconnect.edu',
      password: 'student123',
      studentId: 'STU-2024-001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    {
      id: 'usr_faculty',
      role: 'faculty',
      name: 'Dr. Anita Roy',
      email: 'faculty@uniconnect.edu',
      password: 'faculty123',
      facultyId: 'FAC-101',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
    },
    {
      id: 'usr_parent',
      role: 'parent',
      name: 'Mr. Rajesh Sharma',
      email: 'parent@uniconnect.edu',
      password: 'parent123',
      studentId: 'STU-2024-001', // Linked to Rahul Sharma
      childName: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'
    },
    {
      id: 'usr_admin',
      role: 'admin',
      name: 'Dr. S. K. Narayana',
      email: 'admin@uniconnect.edu',
      password: 'admin123',
      designation: 'Registrar & Chief Administrator',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'
    }
  ],

  students: [
    {
      id: 'STU-2024-001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@uniconnect.edu',
      rollNo: '21NU048',
      department: 'Computer Science & Engineering',
      semester: 6,
      section: 'A',
      cgpa: 8.72,
      sgpa: 8.85,
      dob: '2004-05-14',
      phone: '+91 98765 43210',
      parentName: 'Rajesh Sharma',
      parentEmail: 'parent@uniconnect.edu',
      parentPhone: '+91 98765 11223',
      address: 'Plot 42, Green Park Avenue, Hyderabad',
      enrolledCourses: ['CS601', 'CS602', 'CS604'],
      creditsEarned: 110,
      currentSemesterCredits: 11,
      attendanceOverall: 84.2,
      mentor: 'Dr. Anita Roy',
      status: 'Active'
    },
    {
      id: 'STU-2024-002',
      name: 'Priya Patel',
      email: 'priya.patel@uniconnect.edu',
      rollNo: '21NU049',
      department: 'Computer Science & Engineering',
      semester: 6,
      section: 'A',
      cgpa: 7.95,
      sgpa: 7.80,
      dob: '2004-08-22',
      phone: '+91 98765 43211',
      parentName: 'Suresh Patel',
      parentEmail: 'suresh.patel@gmail.com',
      parentPhone: '+91 98765 11224',
      address: 'Flat 302, Lakeview Towers, Vijayawada',
      enrolledCourses: ['CS601', 'CS603', 'CS604'],
      creditsEarned: 106,
      currentSemesterCredits: 11,
      attendanceOverall: 71.5, // Alert < 75%
      mentor: 'Dr. Anita Roy',
      status: 'Active'
    },
    {
      id: 'STU-2024-003',
      name: 'Aman Verma',
      email: 'aman.verma@uniconnect.edu',
      rollNo: '21NU050',
      department: 'Electronics & Communication',
      semester: 4,
      section: 'B',
      cgpa: 9.15,
      sgpa: 9.30,
      dob: '2005-01-10',
      phone: '+91 98765 43212',
      parentName: 'Vikas Verma',
      parentEmail: 'vikas.verma@gmail.com',
      parentPhone: '+91 98765 11225',
      address: 'Sector 14, Urban Estate, Guntur',
      enrolledCourses: ['CS601', 'CS602'],
      creditsEarned: 74,
      currentSemesterCredits: 7,
      attendanceOverall: 92.0,
      mentor: 'Prof. Ramesh Rao',
      status: 'Active'
    },
    {
      id: 'STU-2024-004',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@uniconnect.edu',
      rollNo: '21NU051',
      department: 'Computer Science & Engineering',
      semester: 6,
      section: 'A',
      cgpa: 8.42,
      sgpa: 8.60,
      dob: '2004-03-18',
      phone: '+91 98765 43213',
      parentName: 'K. V. Reddy',
      parentEmail: 'kvreddy@gmail.com',
      parentPhone: '+91 98765 11226',
      address: 'H.No 12-4-9, Hill Colony, Nagarjuna Nagar',
      enrolledCourses: ['CS601', 'CS603', 'CS604', 'CS605'],
      creditsEarned: 112,
      currentSemesterCredits: 14,
      attendanceOverall: 88.5,
      mentor: 'Prof. Ramesh Rao',
      status: 'Active'
    },
    {
      id: 'STU-2024-005',
      name: 'Vikram Singh',
      email: 'vikram.singh@uniconnect.edu',
      rollNo: '21NU052',
      department: 'Information Technology',
      semester: 6,
      section: 'B',
      cgpa: 6.85,
      sgpa: 7.10,
      dob: '2003-11-29',
      phone: '+91 98765 43214',
      parentName: 'Mohan Singh',
      parentEmail: 'mohansingh@gmail.com',
      parentPhone: '+91 98765 11227',
      address: 'Opp. Police Station, Main Road, Tenali',
      enrolledCourses: ['CS601', 'CS604'],
      creditsEarned: 98,
      currentSemesterCredits: 8,
      attendanceOverall: 67.8, // Critical alert < 70%
      mentor: 'Dr. Suresh Kumar',
      status: 'Active'
    },
    {
      id: 'STU-2024-006',
      name: 'Ananya Roy',
      email: 'ananya.roy@uniconnect.edu',
      rollNo: '21NU053',
      department: 'Computer Science & Engineering',
      semester: 6,
      section: 'A',
      cgpa: 8.92,
      sgpa: 9.05,
      dob: '2004-09-05',
      phone: '+91 98765 43215',
      parentName: 'Subhash Roy',
      parentEmail: 'subhashroy@gmail.com',
      parentPhone: '+91 98765 11228',
      address: 'Road No 7, Banjara Hills, Hyderabad',
      enrolledCourses: ['CS601', 'CS602', 'CS603', 'CS604'],
      creditsEarned: 115,
      currentSemesterCredits: 14,
      attendanceOverall: 94.2,
      mentor: 'Dr. Anita Roy',
      status: 'Active'
    }
  ],

  faculty: [
    {
      id: 'FAC-101',
      name: 'Dr. Anita Roy',
      email: 'faculty@uniconnect.edu',
      phone: '+91 98111 22334',
      department: 'Computer Science & Engineering',
      designation: 'Professor & Head of Department',
      qualification: 'Ph.D in Cloud Computing & Systems (IIT Delhi)',
      experience: '16 Years',
      office: 'CS Block, Room 304',
      assignedCourses: ['CS601', 'CS602'],
      menteesCount: 22,
      rating: 4.8
    },
    {
      id: 'FAC-102',
      name: 'Prof. Ramesh Rao',
      email: 'ramesh.rao@uniconnect.edu',
      phone: '+91 98111 22335',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      qualification: 'M.Tech, Ph.D (IISc Bangalore)',
      experience: '12 Years',
      office: 'CS Block, Room 210',
      assignedCourses: ['CS603', 'CS604'],
      menteesCount: 18,
      rating: 4.6
    },
    {
      id: 'FAC-103',
      name: 'Dr. Suresh Kumar',
      email: 'suresh.kumar@uniconnect.edu',
      phone: '+91 98111 22336',
      department: 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      qualification: 'Ph.D in Cybersecurity (NIT Warangal)',
      experience: '8 Years',
      office: 'CS Block, Room 112',
      assignedCourses: ['CS605'],
      menteesCount: 15,
      rating: 4.5
    },
    {
      id: 'FAC-104',
      name: 'Prof. Divya Joshi',
      email: 'divya.joshi@uniconnect.edu',
      phone: '+91 98111 22337',
      department: 'Information Technology',
      designation: 'Assistant Professor',
      qualification: 'M.Tech in Mobile Systems',
      experience: '7 Years',
      office: 'IT Wing, Room 108',
      assignedCourses: ['CS606'],
      menteesCount: 14,
      rating: 4.7
    },
    {
      id: 'FAC-105',
      name: 'Dr. Kavita Nair',
      email: 'kavita.nair@uniconnect.edu',
      phone: '+91 98111 22338',
      department: 'Mathematics & Computing',
      designation: 'Professor',
      qualification: 'Ph.D in Applied Mathematics (Univ of Hyderabad)',
      experience: '19 Years',
      office: 'Basic Sciences Block, Room 402',
      assignedCourses: ['MA601'],
      menteesCount: 20,
      rating: 4.9
    }
  ],

  courses: [
    {
      code: 'CS601',
      title: 'Web Engineering & Modern Frameworks',
      department: 'CSE',
      type: 'Core',
      credits: 4,
      semester: 6,
      facultyId: 'FAC-101',
      facultyName: 'Dr. Anita Roy',
      schedule: 'Mon, Wed, Fri 10:00 AM - 11:00 AM',
      room: 'Room 302',
      maxCapacity: 60,
      enrolledCount: 54,
      syllabus: 'Modern DOM, Component Lifecycle, Reactive State, Async Microservices, WebSockets, Security Headers.',
      description: 'Covers full-stack web application development, security, performance optimization, and scalable architectures.'
    },
    {
      code: 'CS602',
      title: 'Cloud Computing & Distributed Systems',
      department: 'CSE',
      type: 'Elective',
      credits: 3,
      semester: 6,
      facultyId: 'FAC-101',
      facultyName: 'Dr. Anita Roy',
      schedule: 'Tue, Thu 11:15 AM - 12:45 PM',
      room: 'Cloud Lab 1',
      maxCapacity: 50,
      enrolledCount: 42,
      syllabus: 'Virtualization, Containers (Docker/K8s), Serverless, Object Storage, Microservices, Resilience.',
      description: 'Explores cloud platforms, container orchestration, elasticity, distributed consensus, and infrastructure as code.'
    },
    {
      code: 'CS603',
      title: 'Machine Learning & Intelligent Systems',
      department: 'CSE',
      type: 'Elective',
      credits: 3,
      semester: 6,
      facultyId: 'FAC-102',
      facultyName: 'Prof. Ramesh Rao',
      schedule: 'Mon, Wed 02:00 PM - 03:30 PM',
      room: 'AI/ML Lab',
      maxCapacity: 60,
      enrolledCount: 58,
      syllabus: 'Supervised & Unsupervised Learning, Neural Networks, Loss Functions, Model Evaluation, Transformers intro.',
      description: 'Foundations of mathematical modeling, supervised classification, deep learning models, and real-world inference pipelines.'
    },
    {
      code: 'CS604',
      title: 'Advanced Database Management Systems',
      department: 'CSE',
      type: 'Core',
      credits: 4,
      semester: 6,
      facultyId: 'FAC-102',
      facultyName: 'Prof. Ramesh Rao',
      schedule: 'Tue, Thu, Fri 09:00 AM - 10:00 AM',
      room: 'Room 205',
      maxCapacity: 60,
      enrolledCount: 56,
      syllabus: 'Query Optimization, Transaction Concurrency (ACID/MVCC), NoSQL Data Models, Sharding, Distributed Transactions.',
      description: 'In-depth study of storage engines, query processing, B-Tree indexes, NoSQL architectures, and distributed replication.'
    },
    {
      code: 'CS605',
      title: 'Cyber Security & Cryptographic Protocols',
      department: 'CSE',
      type: 'Elective',
      credits: 3,
      semester: 6,
      facultyId: 'FAC-103',
      facultyName: 'Dr. Suresh Kumar',
      schedule: 'Wed, Fri 03:30 PM - 05:00 PM',
      room: 'Security Lab',
      maxCapacity: 45,
      enrolledCount: 30,
      syllabus: 'Symmetric & Asymmetric Ciphers, Zero-Knowledge Proofs, Network Security Protocols, Penetration Testing.',
      description: 'Principles of modern cryptography, threat mitigation, secure network engineering, and ethical penetration testing.'
    },
    {
      code: 'CS606',
      title: 'Mobile Application Architecture & Flutter',
      department: 'IT',
      type: 'Elective',
      credits: 3,
      semester: 6,
      facultyId: 'FAC-104',
      facultyName: 'Prof. Divya Joshi',
      schedule: 'Mon, Thu 03:30 PM - 05:00 PM',
      room: 'Mobile Dev Lab',
      maxCapacity: 45,
      enrolledCount: 36,
      syllabus: 'Declarative UI, State Management (BLoC/Provider), Native Bridges, Offline Caching, App Store deployment.',
      description: 'Cross-platform native mobile application construction using Dart/Flutter and reactive state architectures.'
    },
    {
      code: 'MA601',
      title: 'Quantitative Optimization Techniques',
      department: 'Mathematics',
      type: 'Open Elective',
      credits: 3,
      semester: 6,
      facultyId: 'FAC-105',
      facultyName: 'Dr. Kavita Nair',
      schedule: 'Tue, Fri 02:00 PM - 03:30 PM',
      room: 'Room 401',
      maxCapacity: 40,
      enrolledCount: 22,
      syllabus: 'Linear Programming, Simplex Method, Duality, Non-linear Programming, Genetic Algorithms, Markov Decision Processes.',
      description: 'Mathematical foundations of operations research, constrained optimization, and algorithmic decision sciences.'
    }
  ],

  // Subject-wise student attendance breakdown
  studentAttendance: {
    'STU-2024-001': [
      { courseCode: 'CS601', courseTitle: 'Web Engineering', totalHours: 42, attendedHours: 38, percentage: 90.5, status: 'Good' },
      { courseCode: 'CS602', courseTitle: 'Cloud Computing & Distributed Systems', totalHours: 36, attendedHours: 31, percentage: 86.1, status: 'Good' },
      { courseCode: 'CS604', courseTitle: 'Advanced Database Systems', totalHours: 40, attendedHours: 30, percentage: 75.0, status: 'Warning' }
    ],
    'STU-2024-002': [
      { courseCode: 'CS601', courseTitle: 'Web Engineering', totalHours: 42, attendedHours: 30, percentage: 71.4, status: 'Critical' },
      { courseCode: 'CS603', courseTitle: 'Machine Learning', totalHours: 34, attendedHours: 24, percentage: 70.6, status: 'Critical' },
      { courseCode: 'CS604', courseTitle: 'Advanced Database Systems', totalHours: 40, attendedHours: 29, percentage: 72.5, status: 'Critical' }
    ],
    'STU-2024-003': [
      { courseCode: 'CS601', courseTitle: 'Web Engineering', totalHours: 42, attendedHours: 40, percentage: 95.2, status: 'Good' },
      { courseCode: 'CS602', courseTitle: 'Cloud Computing', totalHours: 36, attendedHours: 32, percentage: 88.9, status: 'Good' }
    ],
    'STU-2024-004': [
      { courseCode: 'CS601', courseTitle: 'Web Engineering', totalHours: 42, attendedHours: 37, percentage: 88.1, status: 'Good' },
      { courseCode: 'CS603', courseTitle: 'Machine Learning', totalHours: 34, attendedHours: 31, percentage: 91.2, status: 'Good' },
      { courseCode: 'CS604', courseTitle: 'Advanced Database Systems', totalHours: 40, attendedHours: 35, percentage: 87.5, status: 'Good' },
      { courseCode: 'CS605', courseTitle: 'Cyber Security', totalHours: 28, attendedHours: 25, percentage: 89.3, status: 'Good' }
    ],
    'STU-2024-005': [
      { courseCode: 'CS601', courseTitle: 'Web Engineering', totalHours: 42, attendedHours: 28, percentage: 66.7, status: 'Critical' },
      { courseCode: 'CS604', courseTitle: 'Advanced Database Systems', totalHours: 40, attendedHours: 27, percentage: 67.5, status: 'Critical' }
    ],
    'STU-2024-006': [
      { courseCode: 'CS601', courseTitle: 'Web Engineering', totalHours: 42, attendedHours: 41, percentage: 97.6, status: 'Good' },
      { courseCode: 'CS602', courseTitle: 'Cloud Computing', totalHours: 36, attendedHours: 34, percentage: 94.4, status: 'Good' },
      { courseCode: 'CS603', courseTitle: 'Machine Learning', totalHours: 34, attendedHours: 32, percentage: 94.1, status: 'Good' },
      { courseCode: 'CS604', courseTitle: 'Advanced Database Systems', totalHours: 40, attendedHours: 37, percentage: 92.5, status: 'Good' }
    ]
  },

  // Daily attendance session logs for faculty to view/mark
  attendanceSessions: [
    {
      id: 'ATT-20261110-CS601',
      courseCode: 'CS601',
      date: '2026-11-10',
      facultyId: 'FAC-101',
      topic: 'React Hooks and Virtual DOM reconciliation',
      records: {
        'STU-2024-001': 'Present',
        'STU-2024-002': 'Absent',
        'STU-2024-003': 'Present',
        'STU-2024-004': 'Present',
        'STU-2024-005': 'Absent',
        'STU-2024-006': 'Present'
      }
    },
    {
      id: 'ATT-20261109-CS602',
      courseCode: 'CS602',
      date: '2026-11-09',
      facultyId: 'FAC-101',
      topic: 'Kubernetes Pod Deployment & Service Discovery',
      records: {
        'STU-2024-001': 'Present',
        'STU-2024-003': 'Present',
        'STU-2024-006': 'Present'
      }
    }
  ],

  // Examinations schedules & results
  examSchedules: [
    {
      id: 'EXAM-01',
      courseCode: 'CS601',
      courseTitle: 'Web Engineering & Modern Frameworks',
      examType: 'End Semester Theory',
      date: '2026-11-20',
      time: '09:30 AM - 12:30 PM',
      duration: '3 Hours',
      hall: 'LH-201 (Hall A)',
      seatNo: 'A-24',
      status: 'Upcoming'
    },
    {
      id: 'EXAM-02',
      courseCode: 'CS604',
      courseTitle: 'Advanced Database Management Systems',
      examType: 'End Semester Theory',
      date: '2026-11-23',
      time: '09:30 AM - 12:30 PM',
      duration: '3 Hours',
      hall: 'LH-203 (Hall B)',
      seatNo: 'B-12',
      status: 'Upcoming'
    },
    {
      id: 'EXAM-03',
      courseCode: 'CS602',
      courseTitle: 'Cloud Computing & Distributed Systems',
      examType: 'End Semester Theory',
      date: '2026-11-26',
      time: '02:00 PM - 05:00 PM',
      duration: '3 Hours',
      hall: 'LH-105 (Lab Complex)',
      seatNo: 'C-08',
      status: 'Upcoming'
    },
    {
      id: 'EXAM-04',
      courseCode: 'CS601-LAB',
      courseTitle: 'Web Engineering Practical Lab Exam',
      examType: 'Practical / Viva-Voce',
      date: '2026-11-28',
      time: '10:00 AM - 01:00 PM',
      duration: '3 Hours',
      hall: 'Advanced Software Lab 2',
      seatNo: 'PC-18',
      status: 'Upcoming'
    }
  ],

  // Results for previous semesters & ongoing evaluations
  studentResults: {
    'STU-2024-001': {
      currentSemesterInternal: [
        { courseCode: 'CS601', courseTitle: 'Web Engineering', internal1: 28, internal2: 29, assignment: 10, totalInternal: 67, maxInternal: 70, status: 'On Track' },
        { courseCode: 'CS602', courseTitle: 'Cloud Computing', internal1: 26, internal2: 28, assignment: 9, totalInternal: 63, maxInternal: 70, status: 'On Track' },
        { courseCode: 'CS604', courseTitle: 'Advanced Database Systems', internal1: 24, internal2: 25, assignment: 8, totalInternal: 57, maxInternal: 70, status: 'Satisfactory' }
      ],
      pastSemesters: [
        {
          semester: 5,
          academicYear: '2025-2026 Odd Sem',
          sgpa: 8.85,
          cgpa: 8.72,
          totalCredits: 22,
          result: 'Distinction',
          subjects: [
            { code: 'CS501', title: 'Software Engineering & Agile', credits: 4, grade: 'A+', points: 9, marks: 89 },
            { code: 'CS502', title: 'Computer Networks', credits: 4, grade: 'A', points: 8, marks: 83 },
            { code: 'CS503', title: 'Operating Systems & Concurrency', credits: 4, grade: 'A', points: 8, marks: 82 },
            { code: 'CS504', title: 'Theory of Computation', credits: 3, grade: 'B+', points: 7, marks: 76 },
            { code: 'CS505', title: 'Artificial Intelligence Foundations', credits: 4, grade: 'O', points: 10, marks: 95 },
            { code: 'CS506', title: 'Networks & OS Practical Lab', credits: 3, grade: 'O', points: 10, marks: 96 }
          ]
        },
        {
          semester: 4,
          academicYear: '2024-2025 Even Sem',
          sgpa: 8.68,
          cgpa: 8.65,
          totalCredits: 23,
          result: 'First Class with Distinction',
          subjects: [
            { code: 'CS401', title: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', points: 9, marks: 87 },
            { code: 'CS402', title: 'Computer Organization & Microprocessors', credits: 4, grade: 'A', points: 8, marks: 81 },
            { code: 'CS403', title: 'Discrete Mathematics', credits: 4, grade: 'A', points: 8, marks: 84 },
            { code: 'CS404', title: 'Object Oriented Programming with Java', credits: 4, grade: 'O', points: 10, marks: 92 },
            { code: 'CS405', title: 'Environmental Science', credits: 3, grade: 'A+', points: 9, marks: 88 },
            { code: 'CS406', title: 'Algorithms Lab', credits: 4, grade: 'O', points: 10, marks: 94 }
          ]
        }
      ]
    }
  },

  // Marks uploaded by faculty for each course
  facultyMarksLedger: {
    'CS601': [
      { studentId: 'STU-2024-001', studentName: 'Rahul Sharma', rollNo: '21NU048', test1: 28, test2: 29, assignment: 10, grade: 'A+' },
      { studentId: 'STU-2024-002', studentName: 'Priya Patel', rollNo: '21NU049', test1: 22, test2: 21, assignment: 8, grade: 'B' },
      { studentId: 'STU-2024-003', studentName: 'Aman Verma', rollNo: '21NU050', test1: 30, test2: 29, assignment: 10, grade: 'O' },
      { studentId: 'STU-2024-004', studentName: 'Sneha Reddy', rollNo: '21NU051', test1: 27, test2: 28, assignment: 9, grade: 'A+' },
      { studentId: 'STU-2024-005', studentName: 'Vikram Singh', rollNo: '21NU052', test1: 19, test2: 20, assignment: 7, grade: 'C' },
      { studentId: 'STU-2024-006', studentName: 'Ananya Roy', rollNo: '21NU053', test1: 29, test2: 30, assignment: 10, grade: 'O' }
    ],
    'CS602': [
      { studentId: 'STU-2024-001', studentName: 'Rahul Sharma', rollNo: '21NU048', test1: 26, test2: 28, assignment: 9, grade: 'A' },
      { studentId: 'STU-2024-003', studentName: 'Aman Verma', rollNo: '21NU050', test1: 29, test2: 28, assignment: 10, grade: 'O' },
      { studentId: 'STU-2024-006', studentName: 'Ananya Roy', rollNo: '21NU053', test1: 30, test2: 29, assignment: 10, grade: 'O' }
    ]
  },

  // Fee Details
  fees: {
    'STU-2024-001': {
      studentId: 'STU-2024-001',
      studentName: 'Rahul Sharma',
      totalPayable: 101500,
      totalPaid: 73500,
      totalPending: 28000,
      breakdown: [
        {
          id: 'FEE-01',
          feeType: 'Tuition Fee - Semester VI',
          dueDate: '2026-08-31',
          amount: 65000,
          paidAmount: 65000,
          status: 'Paid',
          paymentDate: '2026-08-15',
          receiptNo: 'REC-2026-8891',
          mode: 'Online UPI'
        },
        {
          id: 'FEE-02',
          feeType: 'Examination & Evaluation Fee',
          dueDate: '2026-09-10',
          amount: 3500,
          paidAmount: 3500,
          status: 'Paid',
          paymentDate: '2026-09-02',
          receiptNo: 'REC-2026-9120',
          mode: 'Debit Card'
        },
        {
          id: 'FEE-03',
          feeType: 'Library & Digital Resource Access',
          dueDate: '2026-08-31',
          amount: 5000,
          paidAmount: 5000,
          status: 'Paid',
          paymentDate: '2026-08-15',
          receiptNo: 'REC-2026-8892',
          mode: 'Net Banking'
        },
        {
          id: 'FEE-04',
          feeType: 'Hostel Accommodation & Mess Dues (Term 2)',
          dueDate: '2026-11-30',
          amount: 28000,
          paidAmount: 0,
          status: 'Pending',
          paymentDate: null,
          receiptNo: null,
          mode: null
        }
      ],
      paymentHistory: [
        {
          receiptNo: 'REC-2026-8891',
          date: '2026-08-15',
          description: 'Tuition Fee - Semester VI',
          amount: 65000,
          status: 'Success',
          paymentMode: 'Online UPI (Ref: UPI/2610815/9981)',
          transactionId: 'TXN-984712391'
        },
        {
          receiptNo: 'REC-2026-8892',
          date: '2026-08-15',
          description: 'Library & Digital Resource Access',
          amount: 5000,
          status: 'Success',
          paymentMode: 'Net Banking - HDFC (Ref: NB/55123)',
          transactionId: 'TXN-984712402'
        },
        {
          receiptNo: 'REC-2026-9120',
          date: '2026-09-02',
          description: 'Examination & Evaluation Fee',
          amount: 3500,
          status: 'Success',
          paymentMode: 'Debit Card (Visa ending in 4092)',
          transactionId: 'TXN-991203817'
        }
      ]
    }
  },

  // Grievance Portal
  grievances: [
    {
      id: 'GRV-2026-101',
      studentId: 'STU-2024-001',
      studentName: 'Rahul Sharma',
      department: 'CSE',
      category: 'Infrastructure',
      title: 'Wi-Fi connectivity drop in Block B 2nd Floor Study Room',
      description: 'The Wi-Fi router on Block B 2nd floor has frequent packet drops and high latency during afternoon study hours, making it hard to download lecture recordings.',
      submittedDate: '2026-11-04 14:20',
      priority: 'Medium',
      status: 'Resolved',
      adminNote: 'Campus IT Infrastructure Cell inspected the access point on Nov 6th and upgraded the firmware. Dual-band 5GHz router installed. Signal verified at 150 Mbps.',
      resolvedDate: '2026-11-06 17:00',
      resolvedBy: 'Dr. S. K. Narayana (Administrator)'
    },
    {
      id: 'GRV-2026-102',
      studentId: 'STU-2024-001',
      studentName: 'Rahul Sharma',
      department: 'CSE',
      category: 'Academic & Curriculum',
      title: 'Clarification on Elective CS603 NPTEL Credit Transfer',
      description: 'Requesting confirmation from academic dean if the 12-week NPTEL Deep Learning certificate can be transferred for 3 credits against CS603 Machine Learning elective.',
      submittedDate: '2026-11-08 10:15',
      priority: 'High',
      status: 'Under Review',
      adminNote: 'Application forwarded to Board of Studies CSE Committee. Committee scheduled to review syllabus mapping on Nov 14th.',
      resolvedDate: null,
      resolvedBy: null
    },
    {
      id: 'GRV-2026-103',
      studentId: 'STU-2024-002',
      studentName: 'Priya Patel',
      department: 'CSE',
      category: 'Attendance & Medical Leave',
      title: 'On-Duty Attendance Approval for Inter-University Smart India Hackathon',
      description: 'Represented Nagarjuna University in the Grand Finale of Smart India Hackathon in New Delhi from Oct 24th to Oct 27th. Duly signed OD certificates and invitation letter attached.',
      submittedDate: '2026-11-09 11:30',
      priority: 'High',
      status: 'Pending',
      adminNote: '',
      resolvedDate: null,
      resolvedBy: null
    },
    {
      id: 'GRV-2026-104',
      studentId: 'STU-2024-005',
      studentName: 'Vikram Singh',
      department: 'IT',
      category: 'Examination & Marks',
      title: 'Retotaling request for Operating Systems Sem 5 answer script',
      description: 'Seeking verification of marks in Question 4(b) which appears omitted from total score.',
      submittedDate: '2026-11-10 16:45',
      priority: 'Medium',
      status: 'Pending',
      adminNote: '',
      resolvedDate: null,
      resolvedBy: null
    }
  ],

  // Announcements & Notifications
  announcements: [
    {
      id: 'ANN-101',
      title: 'End Semester Theory & Practical Examination Schedule (Nov/Dec 2026)',
      category: 'Examination',
      author: 'Office of Controller of Examinations',
      date: '2026-11-10',
      urgent: true,
      audience: 'All Students & Faculty',
      content: 'The official timetable for B.Tech Semester IV, VI, and VIII regular and supplementary examinations has been published. Hall tickets will be available for download starting 15th November 2026. Hall entry requires student ID card and printed admit card.',
      icon: 'calendar'
    },
    {
      id: 'ANN-102',
      title: 'Flexible Credit System: Elective Registration & Add/Drop Window Opens',
      category: 'Academic',
      author: 'Academic Dean Office',
      date: '2026-11-08',
      urgent: false,
      audience: 'Students',
      content: 'In line with the new academic guidelines, students are permitted to add or swap elective courses for Semester VI. The registration window will close on 18th November 2026 at 5:00 PM. Minimum credit threshold: 18 credits; Maximum allowed: 24 credits.',
      icon: 'book-open'
    },
    {
      id: 'ANN-103',
      title: 'Attendance Alert: 75% Minimum Requirement for Examination Eligibility',
      category: 'Attendance',
      author: 'Dean of Student Affairs',
      date: '2026-11-05',
      urgent: true,
      audience: 'Students & Parents',
      content: 'As per university academic regulations, students with attendance below 75% will not be issued examination hall tickets. Those with medical emergencies (65%-74%) must submit condonation forms with hospital verification to the Dean office by 16th November.',
      icon: 'alert-triangle'
    },
    {
      id: 'ANN-104',
      title: 'Guest Lecture on Generative AI & Cloud Architecture by Google Cloud Leader',
      category: 'Department',
      author: 'Dept. of Computer Science & Engineering',
      date: '2026-11-03',
      urgent: false,
      audience: 'CSE & IT Students',
      content: 'The Department of CSE is organizing an interactive session on "Scalable Distributed Computing & Gemini Models" on Friday, 14th November at 3:00 PM in the Main Auditorium. Registration is free for UniConnect users.',
      icon: 'award'
    }
  ]
};

// Export to window
if (typeof window !== 'undefined') {
  window.UniConnectSeed = UniConnectSeed;
}

