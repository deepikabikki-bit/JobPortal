import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';
import { formatSalary, formatDate, timeAgo } from '../utils/formatters';
import {
  MapPin,
  Briefcase,
  Clock,
  ExternalLink,
  Users,
  CheckCircle,
  Share2,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  Loader2,
  ShieldCheck
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isSeeker } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobsAPI.getJobById(id);
        setJob(res.data.job);
      } catch (err) {
        setError('Job opening not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#52796F] animate-spin" />
        <p className="text-xs font-medium text-[#52796F]">Loading opening details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-[#CAD2C5] text-center shadow-lg">
        <h2 className="text-xl font-bold text-[#2F3E46] mb-2">Job Not Found</h2>
        <p className="text-xs text-[#354F52] mb-6">{error || 'This job is no longer active.'}</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Other Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#52796F] hover:text-[#2F3E46] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CAD2C5] bg-white text-xs font-medium text-[#354F52] hover:bg-[#CAD2C5]/30 transition-colors shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-[#52796F]" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Opening'}</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD2C5] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-[#CAD2C5] bg-[#F4F7F5] flex items-center justify-center p-2.5 shadow-xs overflow-hidden flex-shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-[#CAD2C5]/40 text-[#2F3E46] font-extrabold text-2xl flex items-center justify-center">
                  {job.companyName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#354F52]">{job.companyName}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F3E46] bg-[#CAD2C5]/40 px-2 py-0.5 rounded-md border border-[#52796F]">
                  <ShieldCheck className="w-3 h-3 text-[#52796F]" /> Verified Employer
                </span>
                {job.isFeatured && (
                  <span className="text-[11px] font-bold text-[#CAD2C5] bg-[#354F52] px-2 py-0.5 rounded-md border border-[#52796F]">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2F3E46] tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#52796F]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#52796F]" />
                  {job.location} ({job.workplaceType})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#52796F]" />
                  Posted {timeAgo(job.createdAt)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#52796F]" />
                  {job.applicationsCount || 0} applied
                </span>
              </div>
            </div>
          </div>

          {/* Quick Apply Action Box */}
          <div className="flex flex-col sm:items-end justify-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-[#CAD2C5]/60 flex-shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-[#52796F] font-semibold block">
                {job.jobType === 'Internship' ? 'Stipend Offered' : 'Compensation (CTC)'}
              </span>
              <span className="text-2xl font-extrabold text-[#2F3E46]">
                {formatSalary(job.salary)}
              </span>
            </div>

            <button
              onClick={() => setApplyModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Apply for this Job</span>
              <Sparkles className="w-4 h-4 text-[#84A98C]" />
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-8 pt-6 border-t border-[#CAD2C5]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#F4F7F5] border border-[#CAD2C5]">
            <span className="text-[#52796F] block text-[11px] font-semibold">Job Type</span>
            <span className="text-[#2F3E46] font-bold mt-0.5 block">{job.jobType}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F4F7F5] border border-[#CAD2C5]">
            <span className="text-[#52796F] block text-[11px] font-semibold">Experience Level</span>
            <span className="text-[#2F3E46] font-bold mt-0.5 block">{job.experienceLevel}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#F4F7F5] border border-[#CAD2C5]">
            <span className="text-[#52796F] block text-[11px] font-semibold">Eligible Batches</span>
            <span className="text-[#2F3E46] font-bold mt-0.5 block">
              {job.eligibleBatches?.join(', ') || 'All Batches'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F4F7F5] border border-[#CAD2C5]">
            <span className="text-[#52796F] block text-[11px] font-semibold">Application Deadline</span>
            <span className="text-[#2F3E46] font-bold mt-0.5 block">
              {formatDate(job.deadline)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Details Grid: Left Column Details + Right Column Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Responsibilities, Requirements */}
        <div className="lg:col-span-2 space-y-6">
          {/* About The Role */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD2C5] shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-[#2F3E46]">About the Opportunity</h2>
            <div className="text-sm text-[#354F52] leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD2C5] shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#2F3E46]">Day-to-Day Responsibilities</h2>
              <ul className="space-y-2.5 text-sm text-[#354F52]">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#52796F] mt-2 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Candidate Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD2C5] shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#2F3E46]">Eligibility & Qualifications</h2>
              <ul className="space-y-2.5 text-sm text-[#354F52]">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#52796F] mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CAD2C5] shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#2F3E46]">Required Skills & Technologies</h2>
              <div className="flex flex-wrap items-center gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F4F7F5] text-[#2F3E46] text-xs font-semibold border border-[#CAD2C5]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Company Profile & Fresher Tips */}
        <div className="space-y-6">
          {/* Company Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#CAD2C5] shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#52796F]">
              About the Company
            </h3>
            <div>
              <h4 className="text-lg font-extrabold text-[#2F3E46]">{job.companyName}</h4>
              <p className="text-xs text-[#354F52] mt-1">
                {job.company?.description || 'Leading technology company hiring top campus talent.'}
              </p>
            </div>

            <div className="pt-3 border-t border-[#CAD2C5]/60 space-y-2.5 text-xs text-[#354F52]">
              <div className="flex items-center justify-between">
                <span className="text-[#52796F]">Headquarters</span>
                <span className="font-semibold text-[#2F3E46]">{job.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52796F]">Industry</span>
                <span className="font-semibold text-[#2F3E46]">
                  {job.company?.industry || 'Technology & Software'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#52796F]">Company Size</span>
                <span className="font-semibold text-[#2F3E46]">
                  {job.company?.companySize || '50-200 employees'}
                </span>
              </div>
            </div>

            {job.company?.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-[#CAD2C5] text-xs font-semibold text-[#354F52] hover:bg-[#CAD2C5]/30 hover:border-[#52796F] transition-colors"
              >
                <span>Visit Company Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#52796F]" />
              </a>
            )}
          </div>

          {/* Tips for Freshers Card */}
          <div className="bg-[#CAD2C5]/30 rounded-3xl p-6 border border-[#CAD2C5] space-y-3">
            <div className="flex items-center gap-2 text-[#2F3E46]">
              <Lightbulb className="w-5 h-5 text-[#52796F]" />
              <h3 className="text-sm font-bold">Fresher Applicant Advice</h3>
            </div>
            <p className="text-xs text-[#354F52] leading-relaxed">
              Recruiters looking at fresh graduates value <strong>problem-solving</strong> and <strong>hands-on projects</strong> over work tenure.
            </p>
            <ul className="text-xs text-[#354F52] space-y-2 pt-1">
              <li className="flex items-start gap-2">
                <span className="text-[#52796F] font-bold">•</span>
                <span>Ensure your GitHub repository has a clean README with live demo links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#52796F] font-bold">•</span>
                <span>List your graduation year ({job.eligibleBatches?.[0] || '2025'}) prominently on your resume.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#52796F] font-bold">•</span>
                <span>Use the cover note to mention your favorite tech stack module or capstone project.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onSuccess={() => {
          setJob((prev) => ({ ...prev, applicationsCount: (prev.applicationsCount || 0) + 1 }));
        }}
      />
    </div>
  );
};

export default JobDetails;
