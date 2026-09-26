import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
  updateProfile: (profileData) => API.put('/auth/profile', profileData),
  uploadResume: (formData) => API.post('/auth/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Jobs APIs
export const jobsAPI = {
  getJobs: (params) => API.get('/jobs', { params }),
  getInternships: (params) => API.get('/jobs/internships', { params }),
  getRemoteJobs: (params) => API.get('/jobs/remote', { params }),
  getFeaturedJobs: () => API.get('/jobs/featured'),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (jobData) => API.post('/jobs', jobData),
  updateJob: (id, jobData) => API.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
  getMyJobs: () => API.get('/jobs/my-jobs')
};

// Applications APIs
export const applicationsAPI = {
  applyForJob: (jobId, data) => {
    if (data instanceof FormData) {
      return API.post(`/applications/${jobId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return API.post(`/applications/${jobId}`, data);
  },
  getMyApplications: () => API.get('/applications/my-applications'),
  getJobApplicants: (params) => API.get('/applications/recruiter/candidates', { params }),
  updateApplicationStatus: (id, data) => API.put(`/applications/${id}/status`, data),
  withdrawApplication: (id) => API.delete(`/applications/${id}`)
};

// Company APIs
export const companiesAPI = {
  getCompanies: () => API.get('/companies'),
  getCompanyById: (id) => API.get(`/companies/${id}`),
  getMyCompany: () => API.get('/companies/my-company'),
  createOrUpdateCompany: (data) => API.post('/companies', data),
  uploadLogo: (formData) => API.post('/companies/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Admin APIs
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUserStatus: (id) => API.put(`/admin/users/${id}/status`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getJobs: () => API.get('/admin/jobs'),
  toggleJobFeatured: (id) => API.put(`/admin/jobs/${id}/featured`)
};

export default API;
