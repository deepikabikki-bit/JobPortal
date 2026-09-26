import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, applicationsAPI } from '../services/api';
import { formatDate, timeAgo } from '../utils/formatters';
import {
  User,
  FileText,
  Briefcase,
  Upload,
  Trash2,
  CheckCircle,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Loader2,
  Video,
  X
} from 'lucide-react';

const STATUS_COLORS = {
  Applied: 'bg-[#CAD2C5]/30 text-[#354F52] border-[#CAD2C5]',
  'Under Review': 'bg-[#CAD2C5]/60 text-[#2F3E46] border-[#52796F]',
  Shortlisted: 'bg-[#84A98C]/30 text-[#2F3E46] border-[#84A98C]',
  'Interview Scheduled': 'bg-[#52796F]/20 text-[#2F3E46] border-[#52796F]',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  Hired: 'bg-[#84A98C]/50 text-[#2F3E46] border-[#52796F]'
};

const SeekerDashboard = () => {
  const { user, updateUserState } = useAuth();
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'profile'

  // Applications state
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [headline, setHeadline] = useState(user?.seekerProfile?.headline || '');
  const [graduationBatch, setGraduationBatch] = useState(user?.seekerProfile?.graduationBatch || '2025');
  const [skills, setSkills] = useState(user?.seekerProfile?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [githubUrl, setGithubUrl] = useState(user?.seekerProfile?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.seekerProfile?.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.seekerProfile?.portfolioUrl || '');

  // Education state
  const [educationList, setEducationList] = useState(user?.seekerProfile?.education || []);
  const [newDegree, setNewDegree] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newGradYear, setNewGradYear] = useState('');
  const [newCgpa, setNewCgpa] = useState('');

  // Resume Upload State
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch seeker applications
  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await applicationsAPI.getMyApplications();
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Calculate profile completion
  const calculateProfileScore = () => {
    let score = 20; // base account
    if (user?.seekerProfile?.headline) score += 15;
    if (user?.seekerProfile?.skills?.length > 0) score += 20;
    if (user?.seekerProfile?.education?.length > 0) score += 20;
    if (user?.seekerProfile?.resume?.url) score += 25;
    return Math.min(score, 100);
  };

  // Add a skill tag
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Add education
  const handleAddEducation = () => {
    if (!newDegree.trim() || !newInstitution.trim()) return;
    const item = {
      degree: newDegree,
      institution: newInstitution,
      graduationYear: newGradYear || '2025',
      cgpaPercentage: newCgpa || ''
    };
    setEducationList([...educationList, item]);
    setNewDegree('');
    setNewInstitution('');
    setNewGradYear('');
    setNewCgpa('');
  };

  // Delete education
  const handleDeleteEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  // Resume upload handler
  const handleResumeFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploadingResume(true);
    setResumeSuccess('');
    setErrorMessage('');

    try {
      await authAPI.uploadResume(formData);
      setResumeSuccess('Resume uploaded successfully!');
      // Update local auth context
      const meRes = await authAPI.getMe();
      updateUserState(meRes.data.user);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to upload resume file.');
    } finally {
      setUploadingResume(false);
    }
  };

  // Save profile updates
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setSaveSuccess('');
    setErrorMessage('');

    try {
      const payload = {
        name,
        phone,
        bio,
        seekerProfile: {
          headline,
          graduationBatch,
          skills,
          education: educationList,
          githubUrl,
          linkedinUrl,
          portfolioUrl
        }
      };

      const res = await authAPI.updateProfile(payload);
      updateUserState(res.data.user);
      setSaveSuccess('Profile updated successfully!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save profile changes.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Withdraw an application
  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await applicationsAPI.withdrawApplication(appId);
      setApplications(applications.filter((a) => a._id !== appId));
    } catch (err) {
      alert('Failed to withdraw application.');
    }
  };

  const profileScore = calculateProfileScore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Profile Health */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD2C5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#354F52] text-[#84A98C] border border-[#52796F] font-extrabold text-2xl flex items-center justify-center shadow-xs flex-shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'F'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#2F3E46]">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#CAD2C5]/40 text-[#2F3E46] border border-[#CAD2C5]">
                Fresher • Batch {user?.seekerProfile?.graduationBatch || '2025'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#52796F] mt-0.5">
              {user?.seekerProfile?.headline || 'Ready to kickstart tech career'}
            </p>
          </div>
        </div>

        {/* Profile Strength Meter */}
        <div className="bg-[#F4F7F5] p-4 rounded-2xl border border-[#CAD2C5] w-full md:w-72 flex-shrink-0">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-[#2F3E46]">Profile Strength</span>
            <span className="text-[#354F52]">
              {profileScore}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#CAD2C5]/50 overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full bg-[#52796F]"
              style={{ width: `${profileScore}%` }}
            />
          </div>
          <p className="text-[10px] text-[#52796F] mt-1.5">
            {profileScore < 100
              ? 'Upload your resume & add college details for 100% visibility.'
              : '🎉 Profile complete! Recruiters can view all details.'}
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#CAD2C5] pb-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'applications'
              ? 'bg-[#354F52] text-white shadow-xs'
              : 'text-[#52796F] hover:text-[#2F3E46] hover:bg-[#CAD2C5]/30'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Applications ({applications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-[#354F52] text-white shadow-xs'
              : 'text-[#52796F] hover:text-[#2F3E46] hover:bg-[#CAD2C5]/30'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Edit Profile & Resume</span>
        </button>
      </div>

      {/* TAB 1: Applications Tracking */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {loadingApps ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#52796F] animate-spin" />
              <p className="text-xs font-medium text-[#52796F]">Loading your applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#CAD2C5] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#CAD2C5]/30 text-[#354F52] border border-[#CAD2C5] flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#2F3E46]">No applications submitted yet</h3>
              <p className="text-xs text-[#354F52] max-w-sm mx-auto">
                Explore open jobs for freshers and submit your first application with 1-click.
              </p>
              <a
                href="/jobs"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                Browse Fresher Jobs
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl p-6 border border-[#CAD2C5] shadow-xs hover:border-[#84A98C] transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#2F3E46]">
                          {app.job?.title || 'Job Opening'}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                            STATUS_COLORS[app.status] || 'bg-[#F4F7F5] text-[#354F52]'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#52796F] mt-1 font-medium">
                        {app.job?.companyName} • {app.job?.location} • Applied {timeAgo(app.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {app.status === 'Applied' && (
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          className="text-xs text-[#52796F] hover:text-rose-600 font-semibold transition-colors"
                        >
                          Withdraw
                        </button>
                      )}
                      <a
                        href={`/jobs/${app.job?._id}`}
                        className="px-3.5 py-1.5 rounded-xl border border-[#CAD2C5] text-xs font-semibold text-[#354F52] hover:bg-[#CAD2C5]/30 transition-colors"
                      >
                        View Job
                      </a>
                    </div>
                  </div>

                  {/* Interview scheduled notification banner if applicable */}
                  {app.status === 'Interview Scheduled' && app.interviewDetails?.date && (
                    <div className="p-4 rounded-xl bg-[#CAD2C5]/20 border border-[#52796F] text-[#2F3E46] space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#2F3E46]">
                        <Video className="w-4 h-4 text-[#52796F]" />
                        <span>Interview Scheduled by Recruiter!</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#354F52]">
                        <div>
                          <span className="text-[#52796F] font-semibold">Date & Time: </span>
                          <span className="font-semibold text-[#2F3E46]">
                            {new Date(app.interviewDetails.date).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#52796F] font-semibold">Platform: </span>
                          <span className="font-semibold text-[#2F3E46]">{app.interviewDetails.mode}</span>
                        </div>
                      </div>
                      {app.interviewDetails.linkOrVenue && (
                        <div className="text-xs pt-1">
                          <a
                            href={app.interviewDetails.linkOrVenue}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-[#52796F] hover:text-[#2F3E46] underline"
                          >
                            <span>Open Interview Meeting Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status History Timeline */}
                  {app.statusHistory && app.statusHistory.length > 0 && (
                    <div className="pt-3 border-t border-[#CAD2C5]/60">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796F] block mb-2">
                        Application Progress
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {app.statusHistory.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[#354F52]">
                            <span className="w-2 h-2 rounded-full bg-[#52796F]" />
                            <span className="font-semibold text-[#2F3E46]">{step.status}</span>
                            <span className="text-[11px] text-[#52796F]">({formatDate(step.updatedAt)})</span>
                            {idx < app.statusHistory.length - 1 && (
                              <span className="text-[#CAD2C5]">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Profile & Resume Editor */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD2C5] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#CAD2C5]/60">
                <h2 className="text-lg font-bold text-[#2F3E46]">Personal & Academic Details</h2>
                {saveSuccess && (
                  <span className="text-xs font-semibold text-[#52796F] flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> {saveSuccess}
                  </span>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. MERN Stack Developer | 2025 Graduate"
                    className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                    Graduation Batch Year
                  </label>
                  <select
                    value={graduationBatch}
                    onChange={(e) => setGraduationBatch(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] bg-[#F4F7F5]/50 outline-none focus:border-[#52796F]"
                  >
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                  About Me / Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief overview of your technical interests, projects, and career aspirations..."
                  className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                />
              </div>

              {/* Technical Skills Section */}
              <div className="pt-4 border-t border-[#CAD2C5]/60">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-2">
                  Technical Skills
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#CAD2C5]/40 text-[#2F3E46] font-semibold text-xs border border-[#CAD2C5]"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g. Next.js, Docker, Java)"
                    className="flex-1 text-xs p-2.5 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Education List */}
              <div className="pt-4 border-t border-[#CAD2C5]/60 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46]">
                  Education & College History
                </label>

                {educationList.length > 0 && (
                  <div className="space-y-2">
                    {educationList.map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#F4F7F5] border border-[#CAD2C5] flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#2F3E46]">{edu.degree}</p>
                          <p className="text-[11px] text-[#52796F]">
                            {edu.institution} • Class of {edu.graduationYear}{' '}
                            {edu.cgpaPercentage && `(${edu.cgpaPercentage})`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteEducation(idx)}
                          className="p-1.5 text-[#52796F] hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Education Box */}
                <div className="p-4 rounded-2xl border border-dashed border-[#CAD2C5] bg-[#F4F7F5]/50 space-y-3">
                  <span className="text-[11px] font-bold text-[#354F52] block">
                    + Add New Education Entry
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      value={newDegree}
                      onChange={(e) => setNewDegree(e.target.value)}
                      placeholder="Degree (e.g. B.Tech in CSE)"
                      className="p-2 rounded-lg border border-[#CAD2C5] bg-white text-[#2F3E46]"
                    />
                    <input
                      type="text"
                      value={newInstitution}
                      onChange={(e) => setNewInstitution(e.target.value)}
                      placeholder="College / University Name"
                      className="p-2 rounded-lg border border-[#CAD2C5] bg-white text-[#2F3E46]"
                    />
                    <input
                      type="text"
                      value={newGradYear}
                      onChange={(e) => setNewGradYear(e.target.value)}
                      placeholder="Graduation Year (e.g. 2025)"
                      className="p-2 rounded-lg border border-[#CAD2C5] bg-white text-[#2F3E46]"
                    />
                    <input
                      type="text"
                      value={newCgpa}
                      onChange={(e) => setNewCgpa(e.target.value)}
                      placeholder="CGPA or % (e.g. 8.5 CGPA)"
                      className="p-2 rounded-lg border border-[#CAD2C5] bg-white text-[#2F3E46]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="px-4 py-2 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white text-xs font-semibold"
                  >
                    Add to Education
                  </button>
                </div>
              </div>

              {/* Social / Portfolio Links */}
              <div className="pt-4 border-t border-[#CAD2C5]/60 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46]">
                  Developer Profiles
                </label>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-[#52796F]" />
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="flex-1 p-2.5 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-[#52796F]" />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="flex-1 p-2.5 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#52796F]" />
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://yourportfolio.dev"
                      className="flex-1 p-2.5 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all hover:scale-[1.01]"
                >
                  {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Right 1 Col: Resume Upload Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#CAD2C5] shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#52796F]">
                Primary Resume / CV
              </h3>

              {user?.seekerProfile?.resume?.url ? (
                <div className="p-4 rounded-2xl bg-[#CAD2C5]/20 border border-[#52796F]/40 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#354F52] text-[#84A98C] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#2F3E46] truncate">
                        {user.seekerProfile.resume.originalName || 'My Resume.pdf'}
                      </p>
                      <p className="text-[10px] text-[#52796F]">
                        Uploaded on {formatDate(user.seekerProfile.resume.uploadedAt)}
                      </p>
                    </div>
                  </div>

                  <a
                    href={user.seekerProfile.resume.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white text-xs font-semibold transition-colors shadow-xs"
                  >
                    <span>View / Download Resume</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#CAD2C5]/30 border border-[#CAD2C5] text-[#2F3E46] text-xs">
                  <p className="font-bold">No resume uploaded yet!</p>
                  <p className="text-[11px] text-[#52796F] mt-1">Upload your PDF or Word document so recruiters can review your profile.</p>
                </div>
              )}

              {/* Upload Dropzone */}
              <div>
                <label className="border-2 border-dashed border-[#CAD2C5] hover:border-[#52796F] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F4F7F5] hover:bg-[#CAD2C5]/20 text-center">
                  <Upload className="w-8 h-8 text-[#52796F] mb-2" />
                  <span className="text-xs font-bold text-[#2F3E46]">
                    {uploadingResume ? 'Uploading...' : 'Click to Upload / Replace Resume'}
                  </span>
                  <span className="text-[11px] text-[#52796F] mt-1">PDF, DOC, DOCX up to 10MB</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleResumeFileChange}
                    disabled={uploadingResume}
                  />
                </label>
                {resumeSuccess && (
                  <p className="text-xs text-[#52796F] font-semibold mt-2 text-center">
                    {resumeSuccess}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
