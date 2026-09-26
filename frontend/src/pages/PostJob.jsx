import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import {
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If present, edit mode
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [workplaceType, setWorkplaceType] = useState('Remote');
  const [experienceLevel, setExperienceLevel] = useState('Fresher (0-1 yrs)');
  const [eligibleBatches, setEligibleBatches] = useState(['2024', '2025', '2026']);
  const [location, setLocation] = useState('Bengaluru (Remote Available)');
  const [salaryMin, setSalaryMin] = useState(400000);
  const [salaryMax, setSalaryMax] = useState(700000);
  const [salaryPeriod, setSalaryPeriod] = useState('per year');
  const [openings, setOpenings] = useState(2);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [skills, setSkills] = useState('React, JavaScript, HTML, CSS');
  const [isFeatured, setIsFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  // Load existing job if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const res = await jobsAPI.getJobById(id);
          const j = res.data.job;
          setTitle(j.title || '');
          setJobType(j.jobType || 'Full-time');
          setWorkplaceType(j.workplaceType || 'Remote');
          setExperienceLevel(j.experienceLevel || 'Fresher (0-1 yrs)');
          setEligibleBatches(j.eligibleBatches || ['2024', '2025', '2026']);
          setLocation(j.location || '');
          setSalaryMin(j.salary?.min || 300000);
          setSalaryMax(j.salary?.max || 600000);
          setSalaryPeriod(j.salary?.period || 'per year');
          setOpenings(j.openings || 1);
          if (j.deadline) setDeadline(new Date(j.deadline).toISOString().split('T')[0]);
          setDescription(j.description || '');
          setResponsibilities(j.responsibilities?.join('\n') || '');
          setRequirements(j.requirements?.join('\n') || '');
          setSkills(j.skills?.join(', ') || '');
          setIsFeatured(Boolean(j.isFeatured));
        } catch (err) {
          setError('Failed to load existing job details.');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditMode]);

  const toggleBatch = (batchYear) => {
    if (eligibleBatches.includes(batchYear)) {
      setEligibleBatches(eligibleBatches.filter((b) => b !== batchYear));
    } else {
      setEligibleBatches([...eligibleBatches, batchYear]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !location) {
      setError('Please provide title, description, and location.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        jobType,
        workplaceType,
        experienceLevel,
        eligibleBatches,
        location,
        salary: {
          min: Number(salaryMin),
          max: Number(salaryMax),
          currency: 'INR',
          period: salaryPeriod,
          isDisclosed: true
        },
        openings: Number(openings),
        deadline: new Date(deadline),
        description,
        responsibilities: responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
        requirements: requirements.split('\n').map((s) => s.trim()).filter(Boolean),
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        isFeatured
      };

      if (isEditMode) {
        await jobsAPI.updateJob(id, payload);
      } else {
        await jobsAPI.createJob(payload);
      }

      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit job posting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#52796F] animate-spin" />
        <p className="text-xs text-[#52796F]">Loading opening details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/recruiter/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#52796F] hover:text-[#2F3E46] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recruiter Console
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#CAD2C5] shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#52796F]">
            {isEditMode ? 'Modify Job Posting' : 'New Opening for Early Career'}
          </span>
          <h1 className="text-2xl font-extrabold text-[#2F3E46] mt-1">
            {isEditMode ? `Edit Job: ${title}` : 'Post an Entry-Level or Internship Opening'}
          </h1>
          <p className="text-xs text-[#354F52] mt-0.5">
            Reach enthusiastic fresh graduates looking for their first breakthrough in tech.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
              Job Title / Designation *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Junior Frontend Developer (React.js) or Graduate Trainee Engineer"
              className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
            />
          </div>

          {/* Type, Workplace & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => {
                  setJobType(e.target.value);
                  if (e.target.value === 'Internship') {
                    setSalaryPeriod('per month');
                    setSalaryMin(20000);
                    setSalaryMax(35000);
                  } else {
                    setSalaryPeriod('per year');
                    setSalaryMin(400000);
                    setSalaryMax(700000);
                  }
                }}
                className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] bg-[#F4F7F5]/50 outline-none focus:border-[#52796F]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                Workplace Mode
              </label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] bg-[#F4F7F5]/50 outline-none focus:border-[#52796F]"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                Experience Bracket
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] bg-[#F4F7F5]/50 outline-none focus:border-[#52796F]"
              >
                <option value="Fresher (0-1 yrs)">Fresher (0-1 yrs)</option>
                <option value="Internship">Internship</option>
                <option value="0-2 yrs">0-2 yrs</option>
              </select>
            </div>
          </div>

          {/* Location & Eligible Batches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g. Bengaluru, Pune or 'Remote, India'"
                className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                Eligible Graduation Batches
              </label>
              <div className="flex items-center gap-2 pt-1">
                {['2024', '2025', '2026', '2027'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBatch(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      eligibleBatches.includes(b)
                        ? 'bg-[#354F52] text-white border-[#354F52]'
                        : 'bg-[#F4F7F5] text-[#354F52] border-[#CAD2C5] hover:bg-[#CAD2C5]/30'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compensation / Stipend */}
          <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#CAD2C5] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2F3E46] block">
              Compensation / Stipend (INR)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#52796F] mb-1">
                  Min Amount
                </label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CAD2C5] bg-white text-[#2F3E46]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#52796F] mb-1">
                  Max Amount
                </label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CAD2C5] bg-white text-[#2F3E46]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#52796F] mb-1">Period</label>
                <select
                  value={salaryPeriod}
                  onChange={(e) => setSalaryPeriod(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#CAD2C5] bg-white text-[#2F3E46]"
                >
                  <option value="per year">Per Year (Annual CTC)</option>
                  <option value="per month">Per Month (Internship Stipend)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Openings & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                Number of Vacancies
              </label>
              <input
                type="number"
                min="1"
                value={openings}
                onChange={(e) => setOpenings(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] bg-[#F4F7F5]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] bg-[#F4F7F5]/50"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React.js, Node.js, JavaScript, Tailwind, MongoDB"
              className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
              Detailed Job Description *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Explain the role, learning opportunities, team environment, and what makes this position great for freshers..."
              className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
              Day-to-Day Responsibilities (one per line)
            </label>
            <textarea
              rows={4}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="Develop reusable React components&#10;Collaborate with product and QA engineers&#10;Write unit tests"
              className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
              Qualifications & Eligibility Criteria (one per line)
            </label>
            <textarea
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Graduating in 2024, 2025, or 2026&#10;Hands-on academic projects in React&#10;Solid grasp of OOP & Data Structures"
              className="w-full text-xs p-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#CAD2C5]/20 border border-[#CAD2C5]">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-[#354F52] rounded accent-[#354F52]"
            />
            <label htmlFor="isFeatured" className="text-xs text-[#2F3E46] font-semibold cursor-pointer">
              Mark as Featured Opening (Pin to top of homepage and fresher job board)
            </label>
          </div>

          {/* Submit CTA */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#CAD2C5]/60">
            <Link
              to="/recruiter/dashboard"
              className="px-5 py-2.5 rounded-xl border border-[#CAD2C5] text-xs font-semibold text-[#52796F] hover:bg-[#CAD2C5]/30 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-2.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline mr-1" />
                  Saving...
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Publish Fresher Opening'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
