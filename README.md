# 🎓 FresherJobs - Job & Internship Portal for Fresh Graduates

A full-stack, responsive, and modern Job Portal web application built specifically for **fresh college graduates, early-career engineers, and campus recruiters**.

---

## 🌟 Key Features

### 1. 🔐 User Authentication & Role Authorization
- Role-based registration: **Job Seeker (Fresher)** and **Recruiter (Employer)**.
- Secure password hashing using **bcryptjs**.
- **JWT (JSON Web Token)** authentication stored in local storage with automatic header attachment via Axios interceptors.
- Role-based route protection for Seeker, Recruiter, and Admin spaces.
- **⚡ 1-Click Fast Demo Login**: Instantly test Seeker, Recruiter, or Admin accounts with one click on the login screen.

### 2. 👨‍🎓 Job Seeker (Fresher) Dashboard
- **Profile Strength Meter**: Visual progress percentage indicating profile readiness.
- **Academic & College Records**: Add degree, university/college, graduation batch (2024, 2025, 2026), and CGPA/percentage.
- **Skills Tag Manager**: Easily add and remove technical skills.
- **Resume Upload & Management**: Upload PDF / DOC / DOCX resumes via Multer, with download/preview links and timestamp tracking.
- **Social & Dev Links**: GitHub, LinkedIn, and portfolio profile links.
- **Applications Tracking System**: Track applied jobs with real-time status badges:
  - `Applied`
  - `Under Review`
  - `Shortlisted`
  - `Interview Scheduled` (includes direct Google Meet/Zoom link, date & time, and preparation notes)
  - `Rejected` / `Hired`
- Option to withdraw applications.

### 3. 💼 Recruiter (Employer) Dashboard
- **Overview Metrics**: Total active postings, total applicants received, early talent pool stats.
- **Job Management**: Create, edit, and delete job postings.
- **Candidate Pipeline**: Filter applicants by specific job posting and by status.
- **Resume Review**: View applicants' full profile, academic history, skills, cover note, and direct resume download.
- **Application Status Actions**: Move candidates through pipeline stages (Shortlist, Reject, Schedule Interview with date/time and meeting link).
- **Company Profile Manager**: Manage company name, upload company logo, specify headquarters location, industry, and team size.

### 4. 🛡️ Admin Dashboard
- **Platform Analytics**: Total users, total seekers, recruiters, active jobs, and total applications.
- **User Moderation**: View all users, search by name/email, toggle active/suspended status, and delete accounts.
- **Job Moderation**: View all platform job listings, toggle `Featured` badge, and delete expired or inappropriate jobs.
- **Recent Audit Logs**: Real-time stream of latest applications and newly registered users.

### 5. 🔍 Job Listings & Search Filters
- **Live Search**: Search by title, skills (e.g. `React`, `Python`, `SQL`), location, or company name.
- **Comprehensive Filters**:
  - Job Type: Full-time, Internship, Part-time, Contract.
  - Workplace Mode: Remote, Hybrid, On-site.
  - Experience Level: Fresher (0-1 yrs), 0-2 yrs, Internship.
  - Graduation Batch Year: 2024, 2025, 2026, 2027.
  - Min Annual CTC / Stipend.
- **Sorting**: Newest First, Highest Salary, Most Popular.
- **Pagination**: Clean, responsive page navigation.
- **Direct 1-Click Application Modal**: Apply with saved profile resume or upload a custom resume with a personalized pitch.
- **Duplicate Prevention**: Database compound index prevents freshers from applying multiple times to the same job.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, Lucide React, React Router v6, Axios |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken) & bcryptjs |
| **File Storage** | Multer for resume uploads and company logos |

---

## 📁 Project Structure

```
d:/Jobportal/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js        # Register, login, profile, resume upload
│   │   ├── jobController.js         # Job CRUD, search & filtering
│   │   ├── applicationController.js # Apply, candidate status tracking
│   │   ├── companyController.js     # Recruiter company management & logos
│   │   └── adminController.js       # Admin platform moderation & stats
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verify & role authorization
│   │   ├── uploadMiddleware.js      # Multer file storage
│   │   └── errorMiddleware.js       # Global error & 404 handler
│   ├── models/
│   │   ├── User.js                  # Seeker & Recruiter user schema
│   │   ├── Job.js                   # Fresher job schema with text index
│   │   ├── Application.js           # Application status tracking schema
│   │   └── Company.js               # Company profiles schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── companyRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/                     # Uploaded resumes and logos
│   ├── .env                         # Server environment variables
│   ├── package.json
│   ├── seed.js                      # Realistic seed script
│   └── server.js                    # Express application entry
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive header with role badges
│   │   │   ├── Footer.jsx           # Fresher career resources footer
│   │   │   ├── JobCard.jsx          # Reusable job card
│   │   │   ├── ApplyModal.jsx       # 1-Click application dialog
│   │   │   └── ProtectedRoute.jsx   # Role guard wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state & session manager
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero, search, categories, steps
│   │   │   ├── JobListings.jsx      # Search, filter sidebar, pagination
│   │   │   ├── JobDetails.jsx       # Full job specifications & tips
│   │   │   ├── Login.jsx            # 1-Click demo switcher & login
│   │   │   ├── Register.jsx         # Seeker/Recruiter registration
│   │   │   ├── SeekerDashboard.jsx  # Profile score, resume, applications
│   │   │   ├── RecruiterDashboard.jsx # Jobs table, candidate reviews
│   │   │   ├── PostJob.jsx          # Fresher opening creator/editor
│   │   │   ├── AdminDashboard.jsx   # Metrics, user bans, job moderation
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios client & API endpoints
│   │   ├── utils/
│   │   │   └── formatters.js        # Currency, date, and time-ago formatters
│   │   ├── App.jsx                  # Main router config
│   │   ├── index.css                # Tailwind directives & design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## ⚡ Default Demo Credentials

You can use the **1-Click Demo Login** buttons on the `/login` page or use the credentials below:

| Role | Email | Password | What You Can Test |
|---|---|---|---|
| **🎓 Fresher (Seeker)** | `fresher@example.com` | `seekerpassword123` | View profile strength, edit skills, view submitted applications, track interview invite |
| **💼 Recruiter** | `recruiter@techcorp.com` | `recruiterpassword123` | View posted jobs, review applicants, download resumes, update status, schedule interviews |
| **🛡️ Admin** | `admin@fresherjobs.com` | `adminpassword123` | View total users/jobs metrics, suspend/activate users, toggle featured jobs |

---

## 🚀 Running the Project Locally

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on port `27017` (e.g. `mongodb://127.0.0.1:27017`)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Seed the database with sample freshers, recruiters, jobs, and applications
npm run seed

# Start the server (runs on http://localhost:5000)
npm run dev
# or: npm start
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser to experience the portal!

---

## 📡 REST API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new Seeker or Recruiter account
- `POST /api/auth/login` - Authenticate and return JWT token
- `GET /api/auth/me` - Get current authenticated user profile
- `PUT /api/auth/profile` - Update profile, bio, skills, education
- `POST /api/auth/upload-resume` - Upload resume file (PDF/DOC)

### Jobs (`/api/jobs`)
- `GET /api/jobs` - Search and filter active jobs (query: `search`, `jobType`, `workplaceType`, `batch`, `minSalary`, `page`, `limit`)
- `GET /api/jobs/featured` - Get featured jobs for homepage
- `GET /api/jobs/:id` - Get single job details
- `POST /api/jobs` - Post a new job (Recruiter/Admin)
- `PUT /api/jobs/:id` - Edit job posting (Owner Recruiter/Admin)
- `DELETE /api/jobs/:id` - Delete job posting (Owner Recruiter/Admin)
- `GET /api/jobs/my-jobs` - Get all jobs posted by current recruiter

### Applications (`/api/applications`)
- `POST /api/applications/:jobId` - Apply for a job with resume and cover note (Seeker only)
- `GET /api/applications/my-applications` - Get seeker's submitted applications
- `GET /api/applications/recruiter/candidates` - Get applicants for recruiter's jobs
- `PUT /api/applications/:id/status` - Update application status & schedule interviews
- `DELETE /api/applications/:id` - Withdraw application

### Companies (`/api/companies`)
- `GET /api/companies` - List companies with open job counts
- `GET /api/companies/:id` - Get company details
- `GET /api/companies/my-company` - Get recruiter's company profile
- `POST /api/companies` - Create/update company profile
- `POST /api/companies/logo` - Upload company logo image

### Admin (`/api/admin`)
- `GET /api/admin/stats` - Platform metrics and analytics
- `GET /api/admin/users` - Search & list all registered users
- `PUT /api/admin/users/:id/status` - Suspend or activate user
- `DELETE /api/admin/users/:id` - Delete user account
- `GET /api/admin/jobs` - List all jobs
- `PUT /api/admin/jobs/:id/featured` - Toggle featured job status
