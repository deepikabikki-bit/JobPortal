import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  User,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  FileText
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isSeeker, isRecruiter, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#2F3E46] border-b border-[#354F52] text-white shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#354F52] border border-[#52796F] flex items-center justify-center text-[#84A98C] shadow-sm group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-[#84A98C]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#CAD2C5] transition-colors">
                  Fresher<span className="text-[#84A98C]">Jobs</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#354F52] text-[#CAD2C5] border border-[#52796F]">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 text-[#84A98C]" />
                  Entry Level
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/jobs')
                  ? 'bg-[#354F52] text-white border border-[#52796F]/50 font-semibold'
                  : 'text-[#CAD2C5] hover:text-white hover:bg-[#354F52]/60'
              }`}
            >
              Explore Jobs
            </Link>
            <Link
              to="/internships"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/internships')
                  ? 'bg-[#354F52] text-white border border-[#52796F]/50 font-semibold'
                  : 'text-[#CAD2C5] hover:text-white hover:bg-[#354F52]/60'
              }`}
            >
              Internships
            </Link>
            <Link
              to="/remote-roles"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/remote-roles')
                  ? 'bg-[#354F52] text-white border border-[#52796F]/50 font-semibold'
                  : 'text-[#CAD2C5] hover:text-white hover:bg-[#354F52]/60'
              }`}
            >
              Remote Roles
            </Link>

            {/* Role specific quick links */}
            {isSeeker && (
              <Link
                to="/seeker/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/seeker/dashboard')
                    ? 'bg-[#354F52] text-white border border-[#52796F]/50'
                    : 'text-[#CAD2C5] hover:text-white hover:bg-[#354F52]/60'
                }`}
              >
                <FileText className="w-4 h-4 text-[#84A98C]" />
                My Applications
              </Link>
            )}

            {isRecruiter && (
              <>
                <Link
                  to="/recruiter/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/recruiter/dashboard')
                      ? 'bg-[#354F52] text-white border border-[#52796F]/50'
                      : 'text-[#CAD2C5] hover:text-white hover:bg-[#354F52]/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-[#84A98C]" />
                  Recruiter Console
                </Link>
                <Link
                  to="/recruiter/post-job"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-[#84A98C] text-[#2F3E46] hover:bg-[#52796F] hover:text-white transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Post a Job
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin/dashboard')
                    ? 'bg-[#354F52] text-[#84A98C] border border-[#52796F]'
                    : 'text-[#CAD2C5] hover:text-white hover:bg-[#354F52]/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#84A98C]" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Desktop Right Actions (Auth) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#52796F] bg-[#354F52] hover:bg-[#52796F]/50 transition-all text-sm font-medium text-white shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-[#84A98C] text-[#2F3E46] flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate text-white">{user?.name}</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full font-semibold uppercase bg-[#2F3E46] text-[#CAD2C5] border border-[#52796F]">
                    {user?.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#CAD2C5]" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#2F3E46] shadow-2xl border border-[#52796F] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#354F52]">
                      <p className="text-xs text-[#CAD2C5]/70 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                    </div>

                    {isSeeker && (
                      <Link
                        to="/seeker/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#CAD2C5] hover:text-white hover:bg-[#354F52] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#84A98C]" />
                        My Profile & Resume
                      </Link>
                    )}

                    {isRecruiter && (
                      <>
                        <Link
                          to="/recruiter/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#CAD2C5] hover:text-white hover:bg-[#354F52] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#84A98C]" />
                          Manage Jobs & Candidates
                        </Link>
                        <Link
                          to="/recruiter/post-job"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#CAD2C5] hover:text-white hover:bg-[#354F52] transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-[#84A98C]" />
                          Post New Job
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#CAD2C5] hover:text-white hover:bg-[#354F52] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#84A98C]" />
                        Admin Controls
                      </Link>
                    )}

                    <div className="border-t border-[#354F52] my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-300 hover:bg-rose-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#CAD2C5] hover:text-white hover:bg-[#354F52] rounded-xl transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-[#2F3E46] bg-[#84A98C] hover:bg-[#52796F] hover:text-white rounded-xl shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#CAD2C5] hover:text-white hover:bg-[#354F52] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#354F52] bg-[#2F3E46] px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#CAD2C5] hover:text-white hover:bg-[#354F52]"
          >
            Explore Jobs
          </Link>
          <Link
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
              isActive('/internships') ? 'text-white bg-[#354F52]' : 'text-[#CAD2C5] hover:text-white hover:bg-[#354F52]'
            }`}
          >
            Internships
          </Link>
          <Link
            to="/remote-roles"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
              isActive('/remote-roles') ? 'text-white bg-[#354F52]' : 'text-[#CAD2C5] hover:text-white hover:bg-[#354F52]'
            }`}
          >
            Remote Roles
          </Link>

          {isSeeker && (
            <Link
              to="/seeker/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-[#84A98C] bg-[#354F52]"
            >
              Seeker Profile & Applications
            </Link>
          )}

          {isRecruiter && (
            <>
              <Link
                to="/recruiter/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#84A98C] bg-[#354F52]"
              >
                Recruiter Dashboard
              </Link>
              <Link
                to="/recruiter/post-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#CAD2C5] hover:text-white hover:bg-[#354F52]"
              >
                + Post a New Job
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-[#84A98C] bg-[#354F52]"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="border-t border-[#354F52] pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 text-sm text-[#CAD2C5]">
                  Signed in as <span className="font-semibold text-white">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-rose-300 font-medium hover:bg-rose-950/40 rounded-lg"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl border border-[#52796F] text-sm font-semibold text-white hover:bg-[#354F52]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-[#84A98C] hover:bg-[#52796F] text-sm font-bold text-[#2F3E46] hover:text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
