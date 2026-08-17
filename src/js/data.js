/* ========================================
   Mock Data — CampusNova
   All realistic demo data
   ======================================== */

const MockData = {

  // ---- USERS ----
  users: [
    {
      id: 'user-1',
      name: 'Mehadi Hasan Proman',
      email: 'proman@diu.edu.bd',
      password: '123456',
      role: 'student',
      department: 'Software Engineering',
      batch: 'Batch 43',
      university: 'Daffodil International University',
      avatar: null,
      skills: ['JavaScript', 'Python', 'AWS', 'React', 'Node.js'],
      interests: ['Web Development', 'Cloud Computing', 'System Design'],
      courses: ['SE231 System Analysis & Design', 'SE223 Web Engineering', 'CS301 Database Systems'],
      about: 'Passionate software engineering student with a focus on full-stack web development and cloud technologies. Always looking for team collaboration opportunities.',
      availability: 'available',
      status: 'active',
      privacy: {
        profileVisible: true,
        showEmail: true,
        showSkills: true,
        showAvailability: true
      },
      joinDate: '2025-09-01'
    },
    {
      id: 'user-admin',
      name: 'Dr. Kamrul Islam Shahin',
      email: 'shahin@diu.edu.bd',
      password: 'admin123',
      role: 'admin',
      designation: 'Associate Professor',
      department: 'Department of Software Engineering',
      batch: null,
      university: 'Daffodil International University',
      avatar: null,
      skills: ['Software Architecture', 'System Analysis & Design', 'Academic Administration', 'Project Management'],
      interests: ['Software Engineering', 'Capstone Coordination', 'Research'],
      courses: ['Software Engineering Capstone', 'System Analysis & Design'],
      about: 'Associate Professor in the Department of Software Engineering at Daffodil International University. Department administrator and faculty coordinator.',
      availability: 'available',
      status: 'active',
      privacy: {
        profileVisible: true,
        showEmail: true,
        showSkills: true,
        showAvailability: true
      },
      joinDate: '2024-01-15'
    },
    {
      id: 'user-2',
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@diu.edu.bd',
      password: '123456',
      role: 'student',
      department: 'Software Engineering',
      batch: 'Batch 43',
      university: 'Daffodil International University',
      avatar: null,
      skills: ['UI/UX', 'React', 'CSS', 'Figma', 'JavaScript'],
      interests: ['Frontend Development', 'Design Systems', 'User Research'],
      courses: ['SE231 System Analysis & Design', 'SE223 Web Engineering'],
      about: 'Creative designer and frontend developer. Passionate about creating beautiful and intuitive user interfaces.',
      availability: 'available',
      status: 'active',
      privacy: { profileVisible: true, showEmail: true, showSkills: true, showAvailability: true },
      joinDate: '2025-09-01'
    },
    {
      id: 'user-3',
      name: 'Mohammad Kaida Azam',
      email: 'kaida.azam@diu.edu.bd',
      password: '123456',
      role: 'student',
      department: 'Computer Science',
      batch: 'Batch 43',
      university: 'Daffodil International University',
      avatar: null,
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Machine Learning', 'Docker'],
      interests: ['Backend Development', 'Data Science', 'DevOps'],
      courses: ['CS301 Database Systems', 'CS402 Machine Learning', 'CS305 Software Architecture'],
      about: 'Backend developer and data enthusiast. Currently exploring ML applications in software engineering.',
      availability: 'busy',
      status: 'active',
      privacy: { profileVisible: true, showEmail: true, showSkills: true, showAvailability: true },
      joinDate: '2025-01-15'
    },
    {
      id: 'user-4',
      name: 'Tanvir Hossain',
      email: 'tanvir.hossain@diu.edu.bd',
      password: '123456',
      role: 'student',
      department: 'Software Engineering',
      batch: 'Batch 43',
      university: 'Daffodil International University',
      avatar: null,
      skills: ['JavaScript', 'Node.js', 'Docker', 'MongoDB', 'Express'],
      interests: ['Full Stack Development', 'Microservices', 'Cloud Native'],
      courses: ['SE231 System Analysis & Design', 'SE223 Web Engineering', 'CS305 Software Architecture'],
      about: 'Full-stack developer with a passion for building scalable backend systems and containerized applications.',
      availability: 'looking-for-team',
      status: 'active',
      privacy: { profileVisible: true, showEmail: true, showSkills: true, showAvailability: true },
      joinDate: '2025-09-01'
    },
    {
      id: 'user-5',
      name: 'Nadia Sultana',
      email: 'nadia.sultana@diu.edu.bd',
      password: '123456',
      role: 'student',
      department: 'Computer Science',
      batch: 'Batch 43',
      university: 'Daffodil International University',
      avatar: null,
      skills: ['Java', 'Spring Boot', 'AWS', 'Kubernetes', 'SQL'],
      interests: ['Enterprise Development', 'Cloud Architecture', 'DevOps'],
      courses: ['CS301 Database Systems', 'CS305 Software Architecture'],
      about: 'Aspiring cloud architect focused on enterprise-grade Java applications and cloud infrastructure.',
      availability: 'available',
      status: 'active',
      privacy: { profileVisible: true, showEmail: true, showSkills: true, showAvailability: true },
      joinDate: '2025-09-01'
    },
    {
      id: 'user-6',
      name: 'Sraya Gharami',
      email: 'sraya.gharami@diu.edu.bd',
      password: '123456',
      role: 'student',
      department: 'Software Engineering',
      batch: 'Batch 43',
      university: 'Daffodil International University',
      avatar: null,
      skills: ['C++', 'Python', 'TensorFlow', 'Computer Vision', 'Linux'],
      interests: ['AI/ML', 'Computer Vision', 'Research'],
      courses: ['CS402 Machine Learning', 'CS410 Computer Vision'],
      about: 'Research-oriented student working on computer vision projects. Enjoy algorithmic challenges.',
      availability: 'busy',
      status: 'active',
      privacy: { profileVisible: true, showEmail: false, showSkills: true, showAvailability: true },
      joinDate: '2025-01-15'
    }
  ],

  // ---- TEAMS ----
  teams: [
    {
      id: 'team-1',
      name: 'CampusNova Development',
      project: 'CampusNova Platform',
      course: 'SE231 System Analysis & Design',
      description: 'Building the CampusNova student collaboration hub as our capstone project. The platform enables students to form teams, share resources, manage tasks, and communicate effectively.',
      leadId: 'user-1',
      members: ['user-1', 'user-2', 'user-4', 'user-5'],
      requiredSkills: ['JavaScript', 'CSS', 'HTML', 'UI/UX', 'Node.js'],
      maxMembers: 6,
      progress: 72,
      deadline: '2026-08-25',
      status: 'active',
      createdAt: '2026-06-01'
    },
    {
      id: 'team-2',
      name: 'Database Research Team',
      project: 'Distributed Database Optimization',
      course: 'CS301 Database Systems',
      description: 'Researching optimization strategies for distributed database systems. Focus on query performance and data sharding techniques.',
      leadId: 'user-3',
      members: ['user-3', 'user-1', 'user-6'],
      requiredSkills: ['PostgreSQL', 'Python', 'Database Design'],
      maxMembers: 4,
      progress: 45,
      deadline: '2026-08-20',
      status: 'active',
      createdAt: '2026-06-15'
    },
    {
      id: 'team-3',
      name: 'Cloud Computing Project',
      project: 'Cloud-Native Microservices Demo',
      course: 'CS305 Software Architecture',
      description: 'Developing a cloud-native application using microservices architecture. Deploying on AWS with containerized services.',
      leadId: 'user-5',
      members: ['user-5', 'user-4', 'user-3'],
      requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Java'],
      maxMembers: 5,
      progress: 30,
      deadline: '2026-09-10',
      status: 'active',
      createdAt: '2026-07-01'
    },
    {
      id: 'team-4',
      name: 'AI Study Group',
      project: 'ML Model Comparison Study',
      course: 'CS402 Machine Learning',
      description: 'Comparative study of machine learning models for text classification. Exploring NLP techniques and model evaluation.',
      leadId: 'user-6',
      members: ['user-6', 'user-3'],
      requiredSkills: ['Python', 'TensorFlow', 'Machine Learning'],
      maxMembers: 4,
      progress: 60,
      deadline: '2026-08-30',
      status: 'active',
      createdAt: '2026-06-10'
    }
  ],

  // ---- TASKS ----
  tasks: [
    {
      id: 'task-1', teamId: 'team-1', title: 'Design Dashboard Layout',
      description: 'Create the main dashboard UI with stats cards, project overview, and notification panel.',
      assignee: 'user-2', priority: 'high', deadline: '2026-08-12', status: 'in-progress', createdAt: '2026-08-01'
    },
    {
      id: 'task-2', teamId: 'team-1', title: 'Build Authentication UI',
      description: 'Implement login and registration screens with form validation and demo login buttons.',
      assignee: 'user-1', priority: 'high', deadline: '2026-08-10', status: 'completed', createdAt: '2026-07-28'
    },
    {
      id: 'task-3', teamId: 'team-1', title: 'Implement Task Board',
      description: 'Create Kanban-style task management board with TODO, In Progress, Review, and Completed columns.',
      assignee: 'user-4', priority: 'medium', deadline: '2026-08-15', status: 'todo', createdAt: '2026-08-02'
    },
    {
      id: 'task-4', teamId: 'team-1', title: 'Write Project Documentation',
      description: 'Write comprehensive README, user guide, and project documentation for the final submission.',
      assignee: 'user-1', priority: 'medium', deadline: '2026-08-22', status: 'todo', createdAt: '2026-08-05'
    },
    {
      id: 'task-5', teamId: 'team-1', title: 'Final Presentation Slides',
      description: 'Prepare presentation slides for the capstone project final demo and evaluation.',
      assignee: 'user-5', priority: 'low', deadline: '2026-08-24', status: 'todo', createdAt: '2026-08-06'
    },
    {
      id: 'task-6', teamId: 'team-2', title: 'Prepare Database Schema',
      description: 'Design and document the database schema for the distributed database project.',
      assignee: 'user-3', priority: 'high', deadline: '2026-08-13', status: 'in-progress', createdAt: '2026-08-01'
    },
    {
      id: 'task-7', teamId: 'team-2', title: 'Benchmark Query Performance',
      description: 'Run performance benchmarks on different query optimization strategies.',
      assignee: 'user-6', priority: 'medium', deadline: '2026-08-18', status: 'todo', createdAt: '2026-08-03'
    },
    {
      id: 'task-8', teamId: 'team-3', title: 'Setup AWS Infrastructure',
      description: 'Configure AWS services for the microservices demo environment.',
      assignee: 'user-5', priority: 'high', deadline: '2026-08-20', status: 'review', createdAt: '2026-07-25'
    },
    {
      id: 'task-9', teamId: 'team-3', title: 'Containerize Services',
      description: 'Create Docker containers for each microservice component.',
      assignee: 'user-4', priority: 'medium', deadline: '2026-08-25', status: 'in-progress', createdAt: '2026-08-01'
    },
    {
      id: 'task-10', teamId: 'team-4', title: 'Train Text Classification Model',
      description: 'Train and evaluate multiple ML models for the text classification study.',
      assignee: 'user-6', priority: 'high', deadline: '2026-08-15', status: 'in-progress', createdAt: '2026-07-20'
    }
  ],

  // ---- NOTIFICATIONS ----
  notifications: [
    {
      id: 'notif-1', type: 'team-invite', title: 'Team Invitation',
      message: 'You were invited to join the Cloud Computing Project team.',
      time: '2026-08-10T05:30:00', read: false, link: '#/teams/team-3'
    },
    {
      id: 'notif-2', type: 'task-assigned', title: 'Task Assigned',
      message: 'You have been assigned "Design Dashboard Layout" in CampusNova Development.',
      time: '2026-08-10T04:00:00', read: false, link: '#/tasks'
    },
    {
      id: 'notif-3', type: 'deadline', title: 'Deadline Reminder',
      message: 'Database Schema deadline is in 3 days (Aug 13).',
      time: '2026-08-10T03:00:00', read: false, link: '#/tasks'
    },
    {
      id: 'notif-4', type: 'message', title: 'New Message',
      message: 'Sarah Ahmed sent you a message about the dashboard design.',
      time: '2026-08-09T22:00:00', read: true, link: '#/messages'
    },
    {
      id: 'notif-5', type: 'announcement', title: 'New Announcement',
      message: 'Midterm Project Submission deadline has been updated.',
      time: '2026-08-09T15:00:00', read: true, link: '#/noticeboard'
    },
    {
      id: 'notif-6', type: 'resource', title: 'Resource Shared',
      message: 'Mohammad Kaida Azam shared "Database Normalization.pdf" in Database Research Team.',
      time: '2026-08-09T10:00:00', read: true, link: '#/resources'
    },
    {
      id: 'notif-7', type: 'team-invite', title: 'Collaboration Request',
      message: 'Tanvir Hossain wants to join your CampusNova Development team.',
      time: '2026-08-08T14:00:00', read: true, link: '#/teams/team-1'
    }
  ],

  // ---- NOTICES ----
  notices: [
    {
      id: 'notice-1', title: 'Midterm Project Submission',
      description: 'All midterm project submissions are due by August 20th. Please submit your work through the university portal. Late submissions will incur a 10% penalty per day.',
      category: 'deadline', date: '2026-08-08', author: 'Dr. Kamrul Islam Shahin',
      priority: 'high', read: false
    },
    {
      id: 'notice-2', title: 'University Tech Fest 2026',
      description: 'Join us for the annual University Tech Fest on September 5-7! Showcase your projects, attend workshops, and network with industry professionals. Registration is now open.',
      category: 'event', date: '2026-08-07', author: 'Student Affairs Office',
      priority: 'medium', read: false
    },
    {
      id: 'notice-3', title: 'Database Lab Session Rescheduled',
      description: 'The CS301 Database Systems lab session originally scheduled for August 12th has been moved to August 14th due to maintenance. Same time, same venue.',
      category: 'announcement', date: '2026-08-06', author: 'Dr. Kamrul Islam Shahin',
      priority: 'medium', read: true
    },
    {
      id: 'notice-4', title: 'Software Engineering Presentation Guidelines',
      description: 'Please review the updated presentation guidelines for SE231 capstone project final demos. Each team will have 15 minutes for presentation and 5 minutes for Q&A.',
      category: 'important', date: '2026-08-05', author: 'Prof. Nusrat Jahan',
      priority: 'high', read: true
    },
    {
      id: 'notice-5', title: 'Library Extended Hours During Finals',
      description: 'The university library will extend its operating hours from August 15 to September 1. New hours: 7:00 AM - 11:00 PM daily, including weekends.',
      category: 'announcement', date: '2026-08-04', author: 'Library Administration',
      priority: 'low', read: true
    }
  ],

  // ---- RESOURCES ----
  resources: [
    {
      id: 'res-1', name: 'SE231 Lecture 01 - Introduction to System Analysis',
      type: 'pdf', category: 'Lecture Notes', course: 'SE231 System Analysis & Design',
      uploadedBy: 'user-1', date: '2026-07-15', version: '1.0', size: '2.4 MB'
    },
    {
      id: 'res-2', name: 'Database Normalization Cheat Sheet',
      type: 'pdf', category: 'References', course: 'CS301 Database Systems',
      uploadedBy: 'user-3', date: '2026-07-20', version: '1.1', size: '1.8 MB'
    },
    {
      id: 'res-3', name: 'Software Architecture Notes',
      type: 'pdf', category: 'Lecture Notes', course: 'CS305 Software Architecture',
      uploadedBy: 'user-5', date: '2026-07-22', version: '1.0', size: '3.2 MB'
    },
    {
      id: 'res-4', name: 'AWS Fundamentals Guide',
      type: 'pdf', category: 'References', course: 'CS305 Software Architecture',
      uploadedBy: 'user-4', date: '2026-07-25', version: '2.0', size: '5.1 MB'
    },
    {
      id: 'res-5', name: 'CampusNova Use Case Diagram',
      type: 'png', category: 'Project Files', course: 'SE231 System Analysis & Design',
      uploadedBy: 'user-1', date: '2026-08-01', version: '1.0', size: '450 KB'
    },
    {
      id: 'res-6', name: 'Web Engineering Assignment 03',
      type: 'docx', category: 'Assignments', course: 'SE223 Web Engineering',
      uploadedBy: 'user-2', date: '2026-08-03', version: '1.0', size: '890 KB'
    },
    {
      id: 'res-7', name: 'ML Model Evaluation Slides',
      type: 'pptx', category: 'Slides', course: 'CS402 Machine Learning',
      uploadedBy: 'user-6', date: '2026-08-05', version: '1.0', size: '4.7 MB'
    },
    {
      id: 'res-8', name: 'Docker Containerization Tutorial',
      type: 'pdf', category: 'References', course: 'CS305 Software Architecture',
      uploadedBy: 'user-4', date: '2026-08-06', version: '1.0', size: '2.1 MB'
    }
  ],

  // ---- MESSAGES ----
  conversations: [
    {
      id: 'conv-1',
      type: 'direct',
      participantIds: ['user-1', 'user-2'],
      name: null,
      messages: [
        { id: 'msg-1', senderId: 'user-2', text: 'Hey Mehadi! How\'s the dashboard design going?', time: '2026-08-09T20:00:00' },
        { id: 'msg-2', senderId: 'user-1', text: 'Going well! I\'m working on the stat cards layout right now.', time: '2026-08-09T20:05:00' },
        { id: 'msg-3', senderId: 'user-2', text: 'Nice! I\'ve finished the color system and typography. Want me to send you the design tokens?', time: '2026-08-09T20:10:00' },
        { id: 'msg-4', senderId: 'user-1', text: 'That would be great! Let\'s sync up tomorrow morning.', time: '2026-08-09T20:15:00' },
        { id: 'msg-5', senderId: 'user-2', text: 'Sounds good! I\'ll also prepare the component mockups for the team page. See you tomorrow 👋', time: '2026-08-09T20:20:00' }
      ]
    },
    {
      id: 'conv-2',
      type: 'team',
      participantIds: ['user-1', 'user-2', 'user-4', 'user-5'],
      name: 'CampusNova Development',
      messages: [
        { id: 'msg-6', senderId: 'user-1', text: 'Team update: Authentication UI is complete ✅', time: '2026-08-09T14:00:00' },
        { id: 'msg-7', senderId: 'user-4', text: 'Great work! I\'ll start on the task board this week.', time: '2026-08-09T14:10:00' },
        { id: 'msg-8', senderId: 'user-5', text: 'I\'ve been reviewing the documentation requirements. We need to finalize the user flow diagrams.', time: '2026-08-09T14:20:00' },
        { id: 'msg-9', senderId: 'user-2', text: 'I can help with the flow diagrams. Let me create them in Figma.', time: '2026-08-09T14:30:00' },
        { id: 'msg-10', senderId: 'user-1', text: 'Let\'s aim to have all core features done by Aug 18th so we have time for testing and polish.', time: '2026-08-09T14:45:00' }
      ]
    },
    {
      id: 'conv-3',
      type: 'team',
      participantIds: ['user-1', 'user-3', 'user-6'],
      name: 'Database Research Team',
      messages: [
        { id: 'msg-11', senderId: 'user-3', text: 'I\'ve uploaded the normalization cheat sheet to the resources section.', time: '2026-08-09T10:00:00' },
        { id: 'msg-12', senderId: 'user-6', text: 'Thanks Kaida! I\'ll review it before starting the benchmarks.', time: '2026-08-09T10:15:00' },
        { id: 'msg-13', senderId: 'user-1', text: 'Good progress. Let\'s discuss the schema design in our next meeting.', time: '2026-08-09T10:30:00' }
      ]
    },
    {
      id: 'conv-4',
      type: 'direct',
      participantIds: ['user-1', 'user-3'],
      name: null,
      messages: [
        { id: 'msg-14', senderId: 'user-3', text: 'Mehadi, can you review the database schema I designed?', time: '2026-08-08T16:00:00' },
        { id: 'msg-15', senderId: 'user-1', text: 'Sure, send it over. I\'ll take a look tonight.', time: '2026-08-08T16:30:00' },
        { id: 'msg-16', senderId: 'user-3', text: 'Just uploaded it to the shared resources. Let me know your thoughts!', time: '2026-08-08T17:00:00' }
      ]
    }
  ],

  // ---- COLLABORATION REQUESTS ----
  collaborationRequests: [
    {
      id: 'req-1',
      type: 'join-request',
      fromUserId: 'user-4',
      teamId: 'team-1',
      message: 'I\'d like to join the CampusNova Development team. I have experience with Node.js and Docker.',
      status: 'pending',
      date: '2026-08-08T14:00:00'
    },
    {
      id: 'req-2',
      type: 'invitation',
      fromUserId: 'user-5',
      toUserId: 'user-1',
      teamId: 'team-3',
      message: 'We\'d love to have you on the Cloud Computing Project team!',
      status: 'pending',
      date: '2026-08-10T05:30:00'
    }
  ],

  // ---- REPORTS (for admin moderation) ----
  reports: [
    {
      id: 'report-1', type: 'Discussion', reason: 'Spam',
      content: 'Repeated promotional messages in the Database team discussion.',
      reportedBy: 'user-3', reportedUser: 'user-6',
      status: 'pending', date: '2026-08-09'
    },
    {
      id: 'report-2', type: 'Resource', reason: 'Inappropriate Content',
      content: 'Uploaded file contains copyrighted material without attribution.',
      reportedBy: 'user-2', reportedUser: 'user-4',
      status: 'pending', date: '2026-08-08'
    },
    {
      id: 'report-3', type: 'Message', reason: 'Harassment',
      content: 'Offensive language in direct messages.',
      reportedBy: 'user-5', reportedUser: 'user-6',
      status: 'resolved', date: '2026-08-06'
    }
  ],

  // ---- DISCUSSION POSTS (within teams) ----
  discussions: [
    {
      id: 'disc-1', teamId: 'team-1', authorId: 'user-1',
      content: 'Welcome to CampusNova Development team! Let\'s use this discussion for project-level conversations. For quick messages, use the chat.',
      time: '2026-06-01T10:00:00'
    },
    {
      id: 'disc-2', teamId: 'team-1', authorId: 'user-2',
      content: 'I\'ve completed the initial UI mockups for the dashboard and profile pages. Check the resources section for the latest files.',
      time: '2026-07-20T14:00:00'
    },
    {
      id: 'disc-3', teamId: 'team-1', authorId: 'user-4',
      content: 'Question: Should we implement the task board with drag-and-drop or simple status buttons? I think status dropdowns would be simpler and more reliable.',
      time: '2026-08-02T11:00:00'
    },
    {
      id: 'disc-4', teamId: 'team-1', authorId: 'user-1',
      content: 'Good point Tanvir. Let\'s go with status dropdowns for the prototype. We can always add drag-and-drop later if needed.',
      time: '2026-08-02T11:30:00'
    }
  ],

  // ---- SETTINGS ----
  defaultSettings: {
    emailNotifications: true,
    taskReminders: true,
    announcementNotifications: true,
    theme: 'light'
  },

  // Initialize data in localStorage on first load
  init() {
    if (!Storage.has('initialized_v6')) {
      Storage.set('users', this.users);
      Storage.set('teams', this.teams);
      Storage.set('tasks', this.tasks);
      Storage.set('notifications', this.notifications);
      Storage.set('notices', this.notices);
      Storage.set('resources', this.resources);
      Storage.set('conversations', this.conversations);
      Storage.set('collaboration_requests', this.collaborationRequests);
      Storage.set('reports', this.reports);
      Storage.set('discussions', this.discussions);
      Storage.set('settings', this.defaultSettings);
      Storage.set('initialized_v6', true);
    }
    
    // Update active user session email if user-1 is logged in
    const currentUser = Storage.get('user');
    if (currentUser) {
      if (currentUser.id === 'user-1') {
        currentUser.name = 'Mehadi Hasan Proman';
        currentUser.email = 'proman@diu.edu.bd';
        Storage.set('user', currentUser);
      } else if (currentUser.id === 'user-admin' || currentUser.role === 'admin') {
        currentUser.name = 'Dr. Kamrul Islam Shahin';
        currentUser.email = 'shahin@diu.edu.bd';
        currentUser.department = 'Department of Software Engineering';
        currentUser.designation = 'Associate Professor';
        currentUser.university = 'Daffodil International University';
        Storage.set('user', currentUser);
      }
    }
  },

  // Reset all data
  reset() {
    Storage.clear();
    this.init();
    Toast.success('Demo data has been reset.');
  }
};
