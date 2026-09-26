import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationsAPI, companiesAPI } from '../services/api';
import { formatSalary, timeAgo } from '../utils/formatters';
import {
  Briefcase,
  Users,
  PlusCircle,
  FileText,
  Building,
  Edit,
  Trash2,
  Loader2,
  Upload,
  CheckCircle
} from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'applicants' | 'company'

  // Jobs state
  const [myJobs, setMyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Applicants state
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [filterJobId, setFilterJobId] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Status Update Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewMode, setInterviewMode] = useState('Google Meet');
  const [interviewLink, setInterviewLink] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Company Profile State
  const [company, setCompany] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [companySize, setCompanySize] = useState('11-50');
  const [logoUploading, setLogoUploading] = useState(false);
  const [companySaving, setCompanySaving] = useState(false);
  const [companySuccess, setCompanySuccess] = useState('');

  // Fetch recruiter's jobs
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await jobsAPI.getMyJobs();
      setMyJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Fetch applicants
  const fetchApplicants = async () => {
    setLoadingApplicants(true);
    try {
      const params = {};
      if (filterJobId) params.jobId = filterJobId;
      if (filterStatus !== 'All') params.status = filterStatus;
      const res = await applicationsAPI.getJobApplicants(params);
      setApplicants(res.data.applications || []);
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  // Fetch company
  const fetchCompany = async () => {
    try {
      const res = await companiesAPI.getMyCompany();
      if (res.data.company) {
        const c = res.data.company;
        setCompany(c);
        setCompanyName(c.name || '');
        setWebsite(c.website || '');
        setDescription(c.description || '');
        setIndustry(c.industry || '');
        setLocation(c.location || '');
        setCompanySize(c.companySize || '11-50');
      }
    } catch (err) {
      console.error('Failed to load company details:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCompany();
  }, []);

  useEffect(() => {
    if (activeTab === 'applicants') {
      fetchApplicants();
    }
  }, [activeTab, filterJobId, filterStatus]);

  // Delete Job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await jobsAPI.deleteJob(jobId);
      setMyJobs(myJobs.filter((j) => j._id !== jobId));
    } catch (err) {
      alert('Failed to delete job.');
    }
  };

  // Open modal for candidate status
  const openStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status || 'Under Review');
    setRecruiterNotes(app.recruiterNotes || '');
    if (app.interviewDetails?.date) {
      setInterviewDate(new Date(app.interviewDetails.date).toISOString().slice(0, 16));
    } else {
      setInterviewDate('');
    }
    setInterviewMode(app.interviewDetails?.mode || 'Google Meet');
    setInterviewLink(app.interviewDetails?.linkOrVenue || '');
  };

  // Submit candidate status update
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdatingStatus(true);
    try {
      const payload = {
        status: newStatus,
        recruiterNotes,
        ...(newStatus === 'Interview Scheduled'
          ? {
              interviewDetails: {
                date: interviewDate,
                mode: interviewMode,
                linkOrVenue: interviewLink
              }
            }
          : {})
      };

      await applicationsAPI.updateStatus(selectedApp._id, payload);
      setSelectedApp(null);
      fetchApplicants();
    } catch (err) {
      alert('Failed to update candidate status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Company logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    setLogoUploading(true);
    try {
      const res = await companiesAPI.uploadLogo(formData);
      setCompany(res.data.company);
      alert('Company logo uploaded successfully!');
    } catch (err) {
      alert('Failed to upload logo.');
    } finally {
      setLogoUploading(false);
    }
  };

  // Save company profile
  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setCompanySaving(true);
    setCompanySuccess('');

    try {
      const res = await companiesAPI.createOrUpdateCompany({
        name: companyName,
        website,
        description,
        industry,
        location,
        companySize
      });
      setCompany(res.data.company);
      setCompanySuccess('Company profile saved successfully!');
      setTimeout(() => setCompanySuccess(''), 3000);
    } catch (err) {
      alert('Failed to save company profile.');
    } finally {
      setCompanySaving(false);
    }
  };

  // Metrics
  const totalJobsCount = myJobs.length;
  const totalApplicantsCount = myJobs.reduce((acc, j) => acc + (j.applicationsCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD2C5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#52796F]">
            Employer Control Center
          </span>
          <h1 className="text-2xl font-extrabold text-[#2F3E46] mt-1">
            {company?.name || user?.recruiterProfile?.companyName || 'Recruiter Console'}
          </h1>
          <p className="text-xs text-[#52796F] mt-0.5">
            Logged in as {user?.name} ({user?.recruiterProfile?.designation || 'Hiring Lead'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/post-job"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#84A98C] hover:bg-[#52796F] text-[#2F3E46] hover:text-white font-bold text-xs shadow-xs transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a New Job</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#CAD2C5] shadow-xs">
          <span className="text-xs font-semibold text-[#52796F]">Active Postings</span>
          <p className="text-2xl font-extrabold text-[#2F3E46] mt-1">{totalJobsCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#CAD2C5] shadow-xs">
          <span className="text-xs font-semibold text-[#52796F]">Total Applicants</span>
          <p className="text-2xl font-extrabold text-[#354F52] mt-1">{totalApplicantsCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#CAD2C5] shadow-xs">
          <span className="text-xs font-semibold text-[#52796F]">Early Talent Pool</span>
          <p className="text-2xl font-extrabold text-[#354F52] mt-1">2024 - 2026</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-[#CAD2C5] shadow-xs">
          <span className="text-xs font-semibold text-[#52796F]">Verified Employer</span>
          <p className="text-2xl font-extrabold text-[#52796F] mt-1">100% Active</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#CAD2C5] pb-2">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'jobs'
              ? 'bg-[#354F52] text-white shadow-xs'
              : 'text-[#52796F] hover:text-[#2F3E46] hover:bg-[#CAD2C5]/30'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Job Postings ({myJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applicants')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'applicants'
              ? 'bg-[#354F52] text-white shadow-xs'
              : 'text-[#52796F] hover:text-[#2F3E46] hover:bg-[#CAD2C5]/30'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Pipeline ({applicants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'company'
              ? 'bg-[#354F52] text-white shadow-xs'
              : 'text-[#52796F] hover:text-[#2F3E46] hover:bg-[#CAD2C5]/30'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Company Profile</span>
        </button>
      </div>

      {/* TAB 1: Job Postings */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {loadingJobs ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#52796F] animate-spin" />
              <p className="text-xs font-medium text-[#52796F]">Loading your jobs...</p>
            </div>
          ) : myJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#CAD2C5] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#CAD2C5]/30 text-[#354F52] border border-[#CAD2C5] flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#2F3E46]">No jobs posted yet</h3>
              <p className="text-xs text-[#354F52] max-w-sm mx-auto">
                Create your first fresher opening to start receiving applications from college graduates.
              </p>
              <Link
                to="/recruiter/post-job"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4" /> Post Opening Now
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#CAD2C5] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F7F5] text-[#2F3E46] uppercase tracking-wider font-bold border-b border-[#CAD2C5]">
                    <tr>
                      <th className="px-6 py-3.5">Job Title</th>
                      <th className="px-6 py-3.5">Type & Mode</th>
                      <th className="px-6 py-3.5">Batches</th>
                      <th className="px-6 py-3.5">Applicants</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CAD2C5]/50">
                    {myJobs.map((job) => (
                      <tr key={job._id} className="hover:bg-[#CAD2C5]/10 transition-colors">
                        <td className="px-6 py-4">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="font-bold text-[#2F3E46] hover:text-[#52796F] block line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          <span className="text-[11px] text-[#52796F]">
                            {formatSalary(job.salary)} • Posted {timeAgo(job.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-[#2F3E46] block">{job.jobType}</span>
                          <span className="text-[11px] text-[#52796F]">{job.workplaceType}</span>
                        </td>
                        <td className="px-6 py-4 text-[#354F52]">
                          {job.eligibleBatches?.join(', ') || 'All'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setFilterJobId(job._id);
                              setActiveTab('applicants');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold bg-[#CAD2C5]/40 text-[#2F3E46] hover:bg-[#CAD2C5]/70 border border-[#CAD2C5] transition-colors"
                          >
                            <Users className="w-3 h-3 text-[#52796F]" />
                            <span>{job.applicationsCount || 0} candidates</span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                              job.status === 'active'
                                ? 'bg-[#CAD2C5]/40 text-[#2F3E46] border border-[#52796F]'
                                : 'bg-[#F4F7F5] text-[#52796F]'
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link
                            to={`/recruiter/edit-job/${job._id}`}
                            className="p-1.5 inline-block text-[#52796F] hover:text-[#2F3E46] transition-colors"
                            title="Edit Job"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="p-1.5 inline-block text-[#52796F] hover:text-rose-600 transition-colors"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Candidate Pipeline */}
      {activeTab === 'applicants' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#CAD2C5] flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-[#354F52]">Filter by Opening:</span>
              <select
                value={filterJobId}
                onChange={(e) => setFilterJobId(e.target.value)}
                className="p-2 rounded-xl border border-[#CAD2C5] bg-white font-medium text-[#2F3E46] outline-none focus:border-[#52796F]"
              >
                <option value="">All Job Openings</option>
                {myJobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-[#354F52]">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 rounded-xl border border-[#CAD2C5] bg-white font-medium text-[#2F3E46] outline-none focus:border-[#52796F]"
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired</option>
              </select>
            </div>
          </div>

          {loadingApplicants ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#52796F] animate-spin" />
              <p className="text-xs font-medium text-[#52796F]">Loading applicants...</p>
            </div>
          ) : applicants.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#CAD2C5] space-y-3">
              <Users className="w-12 h-12 text-[#CAD2C5] mx-auto" />
              <h3 className="text-base font-bold text-[#2F3E46]">No candidates match current filters</h3>
              <p className="text-xs text-[#52796F]">Try switching your status filter or job selection.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl p-6 border border-[#CAD2C5] shadow-xs hover:border-[#84A98C] space-y-4 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#2F3E46]">
                          {app.applicant?.name || 'Fresher Applicant'}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#CAD2C5]/30 text-[#2F3E46] border border-[#CAD2C5]">
                          Batch {app.applicant?.seekerProfile?.graduationBatch || '2025'}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            app.status === 'Shortlisted'
                              ? 'bg-[#84A98C]/30 text-[#2F3E46] border-[#84A98C]'
                              : app.status === 'Interview Scheduled'
                              ? 'bg-[#52796F]/20 text-[#2F3E46] border-[#52796F]'
                              : app.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-[#CAD2C5]/40 text-[#354F52] border-[#CAD2C5]'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#52796F] mt-1">
                        Applied for: <strong className="text-[#2F3E46]">{app.job?.title}</strong> •{' '}
                        {app.applicant?.email} • {app.applicant?.phone || 'No phone'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {app.resume?.url && (
                        <a
                          href={app.resume.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#CAD2C5] text-xs font-semibold text-[#354F52] hover:bg-[#CAD2C5]/30 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#52796F]" />
                          <span>View Resume</span>
                        </a>
                      )}

                      <button
                        onClick={() => openStatusModal(app)}
                        className="px-4 py-1.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>

                  {/* Skills & Bio */}
                  {app.applicant?.seekerProfile?.skills && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {app.applicant.seekerProfile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#F4F7F5] text-[#354F52] text-[11px] font-medium border border-[#CAD2C5]/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Cover Note */}
                  {app.coverNote && (
                    <div className="p-3 rounded-xl bg-[#F4F7F5] border border-[#CAD2C5] text-xs text-[#354F52]">
                      <span className="font-bold text-[#2F3E46] block mb-0.5">Applicant Note:</span>
                      <p className="italic">"{app.coverNote}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Company Profile */}
      {activeTab === 'company' && (
        <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD2C5] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#CAD2C5]/60">
            <h2 className="text-lg font-bold text-[#2F3E46]">Company Information</h2>
            {companySuccess && (
              <span className="text-xs font-semibold text-[#52796F] flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> {companySuccess}
              </span>
            )}
          </div>

          {/* Logo preview and upload */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border border-[#CAD2C5] bg-[#F4F7F5] flex items-center justify-center overflow-hidden">
              {company?.logo ? (
                <img src={company.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Building className="w-8 h-8 text-[#52796F]" />
              )}
            </div>
            <div>
              <label className="px-4 py-2 rounded-xl border border-[#CAD2C5] text-xs font-semibold text-[#354F52] hover:bg-[#CAD2C5]/30 cursor-pointer inline-flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-[#52796F]" />
                <span>{logoUploading ? 'Uploading...' : 'Upload Company Logo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={logoUploading}
                />
              </label>
              <p className="text-[11px] text-[#52796F] mt-1">PNG, JPG, SVG up to 2MB</p>
            </div>
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Software & SaaS"
                  className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                  Headquarters Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Karnataka"
                  className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                  Company Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.example.com"
                  className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                  Team Size
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] bg-[#F4F7F5]/50 outline-none focus:border-[#52796F]"
                >
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="500+">500+ Employees</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                About Company
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your company culture, technology stack, and perks for fresh graduates..."
                className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
              />
            </div>

            <button
              type="submit"
              disabled={companySaving}
              className="px-6 py-2.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              {companySaving ? 'Saving...' : 'Save Company Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Candidate Status Update Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2F3E46]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#CAD2C5] space-y-4">
            <h3 className="text-lg font-bold text-[#2F3E46]">
              Update Candidate Status
            </h3>
            <p className="text-xs text-[#52796F]">
              Candidate: <strong>{selectedApp.applicant?.name}</strong> for {selectedApp.job?.title}
            </p>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2F3E46] mb-1.5">Application Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] bg-white text-[#2F3E46] outline-none focus:border-[#52796F]"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>

              {/* Conditional Interview Fields */}
              {newStatus === 'Interview Scheduled' && (
                <div className="p-3.5 rounded-2xl bg-[#CAD2C5]/20 border border-[#52796F] space-y-3">
                  <span className="text-xs font-bold text-[#2F3E46] block">
                    Interview Details for Candidate
                  </span>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#52796F] mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-[#CAD2C5] bg-white text-[#2F3E46]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#52796F] mb-1">
                      Meeting Link / Venue
                    </label>
                    <input
                      type="text"
                      value={interviewLink}
                      onChange={(e) => setInterviewLink(e.target.value)}
                      placeholder="e.g. https://meet.google.com/xyz-abc"
                      className="w-full text-xs p-2 rounded-lg border border-[#CAD2C5] bg-white text-[#2F3E46]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#2F3E46] mb-1.5">
                  Recruiter Feedback / Notes
                </label>
                <textarea
                  rows={3}
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  placeholder="Optional internal feedback or note for candidate..."
                  className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#52796F] hover:bg-[#CAD2C5]/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-5 py-2 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                >
                  {updatingStatus ? 'Updating...' : 'Save & Notify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
