import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  GraduationCap,
  Sparkles
} from 'lucide-react';

const WORKPLACE_TYPES = ['All', 'Remote', 'Hybrid', 'On-site'];
const BATCHES = ['All', '2024', '2025', '2026'];

const Internships = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [workplaceType, setWorkplaceType] = useState(searchParams.get('workplaceType') || 'All');
  const [batch, setBatch] = useState(searchParams.get('batch') || 'All');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setLocation(searchParams.get('location') || '');
    setWorkplaceType(searchParams.get('workplaceType') || 'All');
    setBatch(searchParams.get('batch') || 'All');
    setMinSalary(searchParams.get('minSalary') || '');
    setSort(searchParams.get('sort') || 'newest');
    setPage(1);
  }, [searchParams]);

  // Fetch internships
  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        sort,
        jobType: 'Internship'
      };

      if (search) params.search = search;
      if (location) params.location = location;
      if (workplaceType !== 'All') params.workplaceType = workplaceType;
      if (batch !== 'All') params.batch = batch;
      if (minSalary) params.minSalary = minSalary;

      const res = await jobsAPI.getInternships(params);
      setJobs(res.data.jobs || []);
      setTotalJobs(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [search, location, workplaceType, batch, minSalary, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchInternships();
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setWorkplaceType('All');
    setBatch('All');
    setMinSalary('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#52796F] bg-[#CAD2C5]/30 px-3 py-1 rounded-full border border-[#CAD2C5] mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#52796F]" />
              Paid Internship Opportunities
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2F3E46] mt-1">
              Explore College & Graduate Internships
            </h1>
            <p className="text-xs sm:text-sm text-[#354F52] mt-1">
              Showing {totalJobs} active internship openings with stipends and pre-placement offers (PPO)
            </p>
          </div>

          {/* Sort dropdown & Mobile filter button */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#CAD2C5] bg-white text-xs font-semibold text-[#2F3E46] shadow-xs"
            >
              <Filter className="w-4 h-4 text-[#52796F]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#52796F] font-medium hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#CAD2C5] bg-white font-medium text-[#2F3E46] shadow-xs outline-none focus:border-[#52796F]"
              >
                <option value="newest">Newest First</option>
                <option value="salary-high">Highest Stipend</option>
                <option value="popular">Most Applied</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Strip */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-2.5 rounded-2xl border border-[#CAD2C5] shadow-xs flex flex-col md:flex-row items-center gap-2"
        >
          <div className="flex items-center gap-2.5 w-full md:flex-1 px-3 py-1.5">
            <Search className="w-5 h-5 text-[#52796F] flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search internships by role, skill (React, Node, UI/UX, Python), or company..."
              className="w-full text-xs sm:text-sm text-[#2F3E46] placeholder-[#52796F]/60 outline-none bg-transparent"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')}>
                <X className="w-4 h-4 text-[#52796F] hover:text-[#2F3E46]" />
              </button>
            )}
          </div>

          <div className="hidden md:block w-px h-7 bg-[#CAD2C5]" />

          <div className="flex items-center gap-2.5 w-full md:w-64 px-3 py-1.5">
            <MapPin className="w-5 h-5 text-[#52796F] flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location or 'Remote'..."
              className="w-full text-xs sm:text-sm text-[#2F3E46] placeholder-[#52796F]/60 outline-none bg-transparent"
            />
            {location && (
              <button type="button" onClick={() => setLocation('')}>
                <X className="w-4 h-4 text-[#52796F] hover:text-[#2F3E46]" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white font-semibold text-xs transition-colors shadow-xs"
          >
            Find Internships
          </button>
        </form>
      </div>

      {/* Main Content: Sidebar Filters + Internship Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-[#CAD2C5] p-5 shadow-xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#CAD2C5]/60">
              <span className="flex items-center gap-2 text-sm font-bold text-[#2F3E46]">
                <SlidersHorizontal className="w-4 h-4 text-[#52796F]" />
                Filter Internships
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-[#52796F] hover:text-[#2F3E46] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Filter: Workplace Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-2">
                Workplace Mode
              </label>
              <div className="space-y-1.5">
                {WORKPLACE_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 text-xs text-[#354F52] hover:text-[#2F3E46] cursor-pointer py-1"
                  >
                    <input
                      type="radio"
                      name="internshipWorkplace"
                      checked={workplaceType === type}
                      onChange={() => {
                        setWorkplaceType(type);
                        setPage(1);
                      }}
                      className="text-[#354F52] focus:ring-[#52796F]"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Graduation Batch */}
            <div className="pt-4 border-t border-[#CAD2C5]/60">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-2">
                Eligible Batch
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {BATCHES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBatch(b);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      batch === b
                        ? 'bg-[#354F52] text-white border-[#354F52] shadow-xs'
                        : 'bg-[#F4F7F5] text-[#354F52] border-[#CAD2C5] hover:bg-[#CAD2C5]/30'
                    }`}
                  >
                    {b === 'All' ? 'All Batches' : `${b} Batch`}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Min Monthly Stipend */}
            <div className="pt-4 border-t border-[#CAD2C5]/60">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-2">
                Min. Monthly Stipend
              </label>
              <select
                value={minSalary}
                onChange={(e) => {
                  setMinSalary(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-[#CAD2C5] bg-[#F4F7F5] text-[#2F3E46] outline-none focus:border-[#52796F]"
              >
                <option value="">Any Stipend</option>
                <option value="15000">₹15,000+ / mo</option>
                <option value="25000">₹25,000+ / mo</option>
                <option value="35000">₹35,000+ / mo</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-[#2F3E46]/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#CAD2C5]">
                <span className="text-base font-bold text-[#2F3E46]">Filter Internships</span>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-[#52796F]" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2F3E46] mb-2">Workplace Mode</label>
                <div className="space-y-2">
                  {WORKPLACE_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-xs text-[#354F52]">
                      <input
                        type="radio"
                        name="mInternWorkplace"
                        checked={workplaceType === type}
                        onChange={() => setWorkplaceType(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#CAD2C5]/60">
                <label className="block text-xs font-bold text-[#2F3E46] mb-2">Batch Year</label>
                <div className="grid grid-cols-2 gap-2">
                  {BATCHES.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBatch(b)}
                      className={`p-2 rounded-lg text-xs font-semibold border ${
                        batch === b ? 'bg-[#354F52] text-white border-[#354F52]' : 'bg-[#F4F7F5] border-[#CAD2C5] text-[#354F52]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#CAD2C5]/60 flex items-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="w-1/2 py-2.5 rounded-xl border border-[#CAD2C5] text-xs font-semibold text-[#354F52]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-xs font-semibold text-white"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Internship Listings Column */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#52796F] animate-spin" />
              <p className="text-xs font-medium text-[#52796F]">Loading available internships...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[#CAD2C5] text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#CAD2C5]/30 text-[#354F52] flex items-center justify-center mx-auto border border-[#CAD2C5]">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#2F3E46]">No internships found</h3>
              <p className="text-xs text-[#354F52] max-w-sm mx-auto">
                No active internship postings match your current criteria. Try resetting your filters to see all available internship openings.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onApply={(j) => setSelectedJobForApply(j)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="p-2 rounded-xl border border-[#CAD2C5] bg-white hover:bg-[#CAD2C5]/30 disabled:opacity-40 text-[#354F52] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        page === p
                          ? 'bg-[#354F52] text-white shadow-xs'
                          : 'bg-white border border-[#CAD2C5] text-[#354F52] hover:bg-[#CAD2C5]/30'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-2 rounded-xl border border-[#CAD2C5] bg-white hover:bg-[#CAD2C5]/30 disabled:opacity-40 text-[#354F52] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
        onSuccess={fetchInternships}
      />
    </div>
  );
};

export default Internships;
