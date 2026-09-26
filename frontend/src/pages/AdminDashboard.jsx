import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
  ShieldCheck,
  Users,
  Briefcase,
  FileText,
  Trash2,
  Star,
  Search,
  Loader2,
  TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'jobs'

  // Stats
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  // Jobs
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Fetch Admin Stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.stats);
      setRecentApps(res.data.recentApplications || []);
      setRecentUsers(res.data.recentUsers || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const params = {};
      if (userRoleFilter !== 'All') params.role = userRoleFilter;
      if (userSearch) params.search = userSearch;
      const res = await adminAPI.getUsers(params);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Jobs
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await adminAPI.getJobs();
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'jobs') fetchJobs();
  }, [activeTab, userRoleFilter, userSearch]);

  // Suspend / Activate User
  const handleToggleUserStatus = async (id) => {
    try {
      await adminAPI.toggleUserStatus(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  // Toggle Featured Job
  const handleToggleJobFeatured = async (id) => {
    try {
      await adminAPI.toggleJobFeatured(id);
      fetchJobs();
    } catch (err) {
      alert('Failed to toggle featured status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#2F3E46] text-white rounded-3xl p-6 sm:p-8 border border-[#354F52] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#354F52] text-[#84A98C] border border-[#52796F] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Administrator Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            FresherJobs Management Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#CAD2C5] mt-1">
            Global monitoring of job seekers, campus recruiters, job postings, and security
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#CAD2C5] pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#354F52] text-white shadow-xs'
              : 'text-[#52796F] hover:text-[#2F3E46] hover:bg-[#CAD2C5]/30'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-[#354F52] text-white shadow-xs'
              : 'text-[#52796F] hover:text-[#2F3E46] hover:bg-[#CAD2C5]/30'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Users</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'jobs'
              ? 'bg-[#354F52] text-white shadow-xs'
              : 'text-[#52796F] hover:text-[#2F3E46] hover:bg-[#CAD2C5]/30'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Manage Jobs</span>
        </button>
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#CAD2C5] shadow-xs">
              <span className="text-xs font-semibold text-[#52796F]">Total Registered Users</span>
              <p className="text-2xl font-extrabold text-[#2F3E46] mt-1">
                {stats?.totalUsers || 0}
              </p>
              <div className="text-[11px] text-[#354F52] mt-1">
                {stats?.totalSeekers || 0} Freshers • {stats?.totalRecruiters || 0} Recruiters
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#CAD2C5] shadow-xs">
              <span className="text-xs font-semibold text-[#52796F]">Active Job Openings</span>
              <p className="text-2xl font-extrabold text-[#354F52] mt-1">
                {stats?.activeJobs || 0}
              </p>
              <div className="text-[11px] text-[#354F52] mt-1">
                Out of {stats?.totalJobs || 0} total listings
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#CAD2C5] shadow-xs">
              <span className="text-xs font-semibold text-[#52796F]">Applications Submitted</span>
              <p className="text-2xl font-extrabold text-[#52796F] mt-1">
                {stats?.totalApplications || 0}
              </p>
              <div className="text-[11px] text-[#354F52] mt-1">Direct Fresher Submissions</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#CAD2C5] shadow-xs">
              <span className="text-xs font-semibold text-[#52796F]">Hiring Companies</span>
              <p className="text-2xl font-extrabold text-[#2F3E46] mt-1">
                {stats?.totalCompanies || 0}
              </p>
              <div className="text-[11px] text-[#354F52] mt-1">Verified Organizations</div>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-6 border border-[#CAD2C5] shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2F3E46] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#52796F]" />
                Recent Applications Activity
              </h3>
              <div className="divide-y divide-[#CAD2C5]/50">
                {recentApps.map((app) => (
                  <div key={app._id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#2F3E46]">{app.applicant?.name}</p>
                      <p className="text-[#52796F]">{app.job?.title} ({app.job?.companyName})</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#CAD2C5]/30 text-[#2F3E46] border border-[#CAD2C5]">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#CAD2C5] shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2F3E46] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#52796F]" />
                Recently Registered Users
              </h3>
              <div className="divide-y divide-[#CAD2C5]/50">
                {recentUsers.map((u) => (
                  <div key={u._id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#2F3E46]">{u.name}</p>
                      <p className="text-[#52796F]">{u.email}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#CAD2C5]/30 text-[#2F3E46] border border-[#CAD2C5]">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-[#CAD2C5] flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] flex items-center gap-2 text-xs">
              <Search className="w-4 h-4 text-[#52796F]" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full outline-none text-[#2F3E46] placeholder-[#52796F]/60"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-[#354F52]">Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="p-1.5 rounded-xl border border-[#CAD2C5] bg-white text-[#2F3E46] outline-none"
              >
                <option value="All">All Roles</option>
                <option value="seeker">Freshers (Seekers)</option>
                <option value="recruiter">Recruiters</option>
              </select>
            </div>
          </div>

          {loadingUsers ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#52796F] animate-spin" />
              <p className="text-xs text-[#52796F]">Loading user accounts...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#CAD2C5] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F7F5] text-[#2F3E46] uppercase tracking-wider font-bold border-b border-[#CAD2C5]">
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Details</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CAD2C5]/50">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-[#CAD2C5]/10">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#2F3E46]">{u.name}</p>
                          <p className="text-[11px] text-[#52796F]">{u.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] bg-[#CAD2C5]/30 text-[#2F3E46] border border-[#CAD2C5]">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#354F52] text-[11px]">
                          {u.role === 'seeker'
                            ? `Batch: ${u.seekerProfile?.graduationBatch || '2025'} • Skills: ${u.seekerProfile?.skills?.slice(0, 3).join(', ') || 'N/A'}`
                            : `Company: ${u.recruiterProfile?.companyName || 'N/A'}`}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.status === 'active'
                                ? 'bg-[#CAD2C5]/40 text-[#2F3E46] border border-[#52796F]'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {u.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => handleToggleUserStatus(u._id)}
                                className="px-2.5 py-1 rounded-lg border border-[#CAD2C5] text-[#354F52] hover:bg-[#CAD2C5]/30 text-[11px] font-semibold"
                              >
                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            </>
                          )}
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

      {/* TAB 3: Jobs Moderation */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {loadingJobs ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#52796F] animate-spin" />
              <p className="text-xs text-[#52796F]">Loading platform jobs...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#CAD2C5] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F7F5] text-[#2F3E46] uppercase tracking-wider font-bold border-b border-[#CAD2C5]">
                    <tr>
                      <th className="px-6 py-3.5">Job Title</th>
                      <th className="px-6 py-3.5">Company & Recruiter</th>
                      <th className="px-6 py-3.5">Type / Location</th>
                      <th className="px-6 py-3.5">Featured</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CAD2C5]/50">
                    {jobs.map((j) => (
                      <tr key={j._id} className="hover:bg-[#CAD2C5]/10">
                        <td className="px-6 py-4 font-bold text-[#2F3E46]">
                          {j.title}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#2F3E46]">{j.companyName}</p>
                          <p className="text-[11px] text-[#52796F]">{j.postedBy?.email}</p>
                        </td>
                        <td className="px-6 py-4 text-[#354F52]">
                          {j.jobType} • {j.location}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleJobFeatured(j._id)}
                            className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] font-semibold ${
                              j.isFeatured
                                ? 'bg-[#CAD2C5]/40 text-[#2F3E46] border-[#52796F]'
                                : 'bg-[#F4F7F5] text-[#52796F] border-[#CAD2C5]'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${j.isFeatured ? 'fill-[#52796F] text-[#52796F]' : ''}`} />
                            <span>{j.isFeatured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href={`/jobs/${j._id}`}
                            className="px-3 py-1 rounded-lg border border-[#CAD2C5] text-[#354F52] hover:bg-[#CAD2C5]/30 font-semibold text-[11px] mr-2"
                          >
                            View
                          </a>
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
    </div>
  );
};

export default AdminDashboard;
