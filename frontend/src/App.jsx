import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import JobListings from './pages/JobListings';
import Internships from './pages/Internships';
import RemoteRoles from './pages/RemoteRoles';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import SeekerDashboard from './pages/SeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#F4F7F5] text-[#354F52]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<JobListings />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/remote-roles" element={<RemoteRoles />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Seeker Protected Routes */}
              <Route
                path="/seeker/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['seeker', 'admin']}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Protected Routes */}
              <Route
                path="/recruiter/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/post-job"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/edit-job/:id"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
