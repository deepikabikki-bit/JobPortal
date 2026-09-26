import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2F3E46] text-[#CAD2C5] border-t border-[#354F52]">
      {/* Top Banner */}
      <div className="border-b border-[#354F52] bg-[#263339] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#84A98C] animate-ping"></span>
            <span className="text-sm font-medium text-[#CAD2C5]">
              Over <strong className="text-white">1,500+ fresh graduates</strong> placed in verified companies this month!
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#CAD2C5]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#84A98C]" /> 100% Verified Employers
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#84A98C]" /> 0-2 Years Experience Roles Only
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="w-9 h-9 rounded-xl bg-[#354F52] border border-[#52796F] flex items-center justify-center text-[#84A98C] shadow-sm">
                <Briefcase className="w-5 h-5 text-[#84A98C]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Fresher<span className="text-[#84A98C]">Jobs</span>
              </span>
            </Link>
            <p className="text-sm text-[#CAD2C5]/85 leading-relaxed">
              India's dedicated career launching platform engineered specifically for college students, new graduates, and early-career tech professionals.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#CAD2C5]">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-[#354F52] border border-[#52796F]/50 flex items-center justify-center hover:bg-[#52796F] hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-[#354F52] border border-[#52796F]/50 flex items-center justify-center hover:bg-[#52796F] hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-[#354F52] border border-[#52796F]/50 flex items-center justify-center hover:bg-[#52796F] hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: For Freshers */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              For Fresh Graduates
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs?jobType=Full-time" className="hover:text-[#84A98C] transition-colors">
                  Entry-Level Software Jobs
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-[#84A98C] transition-colors">
                  Paid College Internships
                </Link>
              </li>
              <li>
                <Link to="/remote-roles" className="hover:text-[#84A98C] transition-colors">
                  Work From Home for Freshers
                </Link>
              </li>
              <li>
                <Link to="/jobs?batch=2025" className="hover:text-[#84A98C] transition-colors">
                  2025 Batch Hiring Drives
                </Link>
              </li>
              <li>
                <Link to="/jobs?batch=2026" className="hover:text-[#84A98C] transition-colors">
                  2026 Batch Pre-Placement
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Trending Roles
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs?search=React" className="hover:text-[#84A98C] transition-colors">
                  Junior Frontend (React/Vue)
                </Link>
              </li>
              <li>
                <Link to="/jobs?search=Node" className="hover:text-[#84A98C] transition-colors">
                  Backend Trainee (Node/Python)
                </Link>
              </li>
              <li>
                <Link to="/jobs?search=Data" className="hover:text-[#84A98C] transition-colors">
                  Junior Data Analyst / BI
                </Link>
              </li>
              <li>
                <Link to="/jobs?search=QA" className="hover:text-[#84A98C] transition-colors">
                  Associate QA & Testing
                </Link>
              </li>
              <li>
                <Link to="/jobs?search=UI%2FUX" className="hover:text-[#84A98C] transition-colors">
                  UI/UX Design Trainee
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Recruiters */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              For Recruiters
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/recruiter/post-job" className="hover:text-[#84A98C] transition-colors">
                  Post a Fresher Opening
                </Link>
              </li>
              <li>
                <Link to="/register?role=recruiter" className="hover:text-[#84A98C] transition-colors">
                  Campus Hiring Partner
                </Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" className="hover:text-[#84A98C] transition-colors">
                  Candidate Pipeline
                </Link>
              </li>
              <li>
                <span className="inline-block mt-3 px-3 py-2 rounded-xl bg-[#354F52] border border-[#52796F] text-xs text-[#CAD2C5]">
                  ⚡ Zero platform fee for hiring interns and first-time graduates!
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#354F52] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CAD2C5]/70">
          <p>© {new Date().getFullYear()} FresherJobs Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
