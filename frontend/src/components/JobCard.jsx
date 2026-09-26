import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Clock,
  CheckCircle,
  Users,
  Bookmark,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { formatSalary, timeAgo } from '../utils/formatters';

const JobCard = ({ job, onApply }) => {
  const [saved, setSaved] = useState(false);

  if (!job) return null;

  return (
    <div className="group relative bg-white rounded-3xl p-6 border border-[#CAD2C5] shadow-xs hover:border-[#84A98C] card-hover-lift flex flex-col justify-between overflow-hidden">
      {/* Subtle hover gradient background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#CAD2C5]/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-0" />

      {/* Featured ribbon with shine */}
      {job.isFeatured && (
        <div className="absolute -top-1 right-6 bg-[#354F52] text-[#CAD2C5] border border-[#52796F] text-[10px] font-extrabold px-3 py-1 rounded-b-xl shadow-xs tracking-wider uppercase flex items-center gap-1 badge-shine z-10">
          <Sparkles className="w-3 h-3 text-[#84A98C]" />
          <span>Featured Drive</span>
        </div>
      )}

      <div className="relative z-10">
        {/* Top Header: Company logo & basic info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl border border-[#CAD2C5] bg-[#F4F7F5] flex items-center justify-center p-2 shadow-xs overflow-hidden flex-shrink-0 group-hover:scale-105 group-hover:shadow-md transition-all">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full rounded-xl bg-[#CAD2C5]/40 text-[#2F3E46] font-black text-lg flex items-center justify-center ${
                  job.companyLogo ? 'hidden' : 'flex'
                }`}
              >
                {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
              </div>
            </div>

            <div className="min-w-0 pr-4">
              <Link
                to={`/jobs/${job._id}`}
                className="text-base sm:text-lg font-extrabold text-[#2F3E46] group-hover:text-[#52796F] transition-colors line-clamp-1 block"
              >
                {job.title}
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#354F52]">
                <span className="font-bold text-[#354F52]">{job.companyName}</span>
                <CheckCircle className="w-3.5 h-3.5 text-[#52796F] flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Quick Bookmark button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
            className={`p-2 rounded-xl border transition-colors ${
              saved
                ? 'bg-[#CAD2C5]/40 border-[#52796F] text-[#354F52]'
                : 'border-[#CAD2C5] hover:border-[#52796F] text-[#52796F] hover:text-[#2F3E46]'
            }`}
            title={saved ? 'Job Saved' : 'Save Job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#354F52] text-[#354F52]' : ''}`} />
          </button>
        </div>

        {/* Badges / Key Metadata */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-[#CAD2C5]/30 text-[#2F3E46] border border-[#CAD2C5]">
            <Briefcase className="w-3 h-3 text-[#52796F]" />
            {job.jobType}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-[#CAD2C5]/30 text-[#354F52] border border-[#CAD2C5]">
            <MapPin className="w-3 h-3 text-[#52796F]" />
            {job.workplaceType} • {job.location}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-[#CAD2C5]/30 text-[#354F52] border border-[#CAD2C5]">
            🎓 {job.experienceLevel}
          </span>

          {job.eligibleBatches && job.eligibleBatches.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-[#CAD2C5]/30 text-[#354F52] border border-[#CAD2C5]">
              Batches: {job.eligibleBatches.slice(0, 2).join(', ')}
            </span>
          )}
        </div>

        {/* Short description */}
        <p className="mt-3.5 text-xs text-[#354F52]/80 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          {job.skills &&
            job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#F4F7F5] hover:bg-[#CAD2C5]/50 text-[#354F52] text-[11px] font-semibold border border-[#CAD2C5] transition-colors"
              >
                {skill}
              </span>
            ))}
          {job.skills && job.skills.length > 4 && (
            <span className="text-[11px] text-[#52796F] font-semibold self-center">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Salary, Openings & CTA Buttons */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#CAD2C5]/60 flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#52796F] font-bold">
            {job.jobType === 'Internship' ? 'Stipend' : 'Annual CTC'}
          </div>
          <div className="text-sm sm:text-base font-black text-[#2F3E46]">
            {formatSalary(job.salary)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job._id}`}
            className="p-2.5 rounded-xl text-xs font-bold text-[#354F52] hover:text-[#2F3E46] hover:bg-[#CAD2C5]/40 border border-[#CAD2C5] transition-colors flex items-center justify-center"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onApply ? onApply(job) : null}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#354F52] hover:bg-[#52796F] shadow-xs hover:scale-105 active:scale-95 transition-all"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Meta footnote */}
      <div className="relative z-10 mt-3 flex items-center justify-between text-[11px] text-[#52796F]">
        <span className="flex items-center gap-1 font-medium">
          <Clock className="w-3 h-3 text-[#52796F]" />
          {timeAgo(job.createdAt)}
        </span>
        <span className="flex items-center gap-1 font-medium">
          <Users className="w-3 h-3 text-[#52796F]" />
          {job.applicationsCount || 0} applicants
        </span>
      </div>
    </div>
  );
};

export default JobCard;
