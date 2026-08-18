# CampusNova

**Student Collaboration Hub**

A desktop prototype demonstrating a centralized student collaboration platform for university environments. Built as a capstone project for SE231 System Analysis & Design.

## Features

- **Authentication** — Login, registration, demo accounts
- **Dashboard** — Quick stats, active projects, upcoming tasks, notifications
- **Profile Management** — View/edit student profiles, skills, availability
- **Search & Discovery** — Find students, teams, courses, and resources
- **Team Management** — Create teams, invite members, manage roles
- **Task Management** — Kanban board with TODO/In Progress/Review/Completed
- **Resource Sharing** — Upload and share lecture notes, assignments, slides
- **Messaging** — Individual and team conversations
- **Chatbot** — Rule-based academic collaboration assistant
- **Notice Board** — Announcements, events, deadlines
- **Notifications** — Team invitations, task assignments, deadline reminders
- **Admin Dashboard** — User management, content moderation, system monitoring

## Technology

| Layer | Technology |
|-------|-----------|
| Desktop | Electron.js |
| Structure | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript |
| Data | localStorage (mock data) |

## Demo Accounts

| Role | Name | Email | Password |
|------|------|-------|----------|
| Student | Md Kaida Azam Bhuiyan Tanvir | kaida242-35-212@diu.edu.bd | 123456 |
| Admin / Faculty | Dr. Kamrul Islam Shahin | shahin@diu.edu.bd | admin123 |

You can also use the **"Continue as Demo Student"** or **"Continue as Admin"** buttons on the login screen.

## Run

```bash
npm install
npm start
```

## Prototype Limitations

> **This is a frontend prototype.** It uses local mock data stored in JavaScript objects and localStorage. There is no backend server, database, or external API. All features (authentication, messaging, notifications, etc.) are simulated on the client side to demonstrate the complete UI/UX and application flow.
