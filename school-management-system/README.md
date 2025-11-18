# School Management System

A comprehensive school management system built with Vue 3, TypeScript, Tailwind CSS, and Pinia.

## Features

### 1. Dashboard
- Overview statistics (Students, Teachers, Classes)
- Attendance summary
- Fee summary
- Recent activity feed

### 2. Student Management
- Add/Edit/Delete students
- Upload student photos
- Auto roll number generation
- Filter by class and section

### 3. Teacher Management
- CRUD operations for teachers
- Assign subjects to teachers
- Search and filter functionality

### 4. Subject & Class Management
- Manage subjects
- Assign teachers to classes

### 5. Attendance Management
- Mark student attendance (Present/Absent/Leave)
- Class-wise attendance tracking
- Date-wise attendance records

### 6. Fee Management
- Fee collection tracking
- Payment history
- Fee status monitoring

### 7. Exam & Results
- Add exams
- Upload marks
- View result sheets
- Grade calculation

### 8. Notices & Events
- Post notices
- Notice board
- Event calendar

### 9. Authentication
- Role-based login (Admin/Teacher/Student)
- Secure authentication

### 10. Settings
- School information
- Profile settings
- Change password

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management
- **Vue Router** - Routing
- **Chart.js** - Data visualization (ready to integrate)

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Default Login Credentials

- **Email:** admin@school.com
- **Password:** password
- **Role:** Admin

## Project Structure

```
src/
├── components/       # Reusable components
├── views/           # Page components
├── stores/          # Pinia stores
├── router/          # Vue Router configuration
└── assets/          # Static assets
```

## Future Enhancements

- Dark mode toggle
- Export data (Excel/PDF)
- Multi-language support
- Real-time notifications
- Chat system
- Mobile responsive improvements
