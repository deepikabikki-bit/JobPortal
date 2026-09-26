import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Code2,
  Database,
  Layers,
  Award,
  Zap,
  GraduationCap,
  Building2,
  TrendingUp,
  Flame,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Full Stack & MERN', icon: Layers, count: '140+ roles', query: 'Full Stack' },
  { name: 'Frontend (React/JS)', icon: Code2, count: '180+ roles', query: 'Frontend' },
  { name: 'Data Analyst & BI', icon: Database, count: '90+ roles', query: 'Data' },
  { name: 'QA & Automation', icon: Award, count: '65+ roles', query: 'QA' },
  { name: 'Paid Internships', icon: GraduationCap, count: '110+ roles', query: 'Internship' },
  { name: 'Work From Home', icon: Zap, count: '200+ roles', query: 'Remote' }
];

const HIRING_TICKER = [
  '🎉 Rahul S. placed as React Dev at TechCorp Solutions (₹7.0 LPA)',
  '🚀 FinTech Plus opened 8 Graduate Trainee openings in Pune',
  '⚡ InnovateHub actively hiring MERN Interns (₹35k/mo + PPO)',
  '🌟 Priya P. shortlisted for Frontend Engineer Trainee',
  '🎓 2025 & 2026 Batch Campus Recruitment Drives Live',
  '🔥 Over 1,500+ freshers interviewed and hired this month'
];

// Animated Number Counter Hook
const useCounter = (target, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 25);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 25);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};

const Home = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [locationKeyword, setLocationKeyword] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Animated counters
  const freshersCount = useCounter(1500);
  const companiesCount = useCounter(300);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await jobsAPI.getFeaturedJobs();
        setFeaturedJobs(res.data.jobs || []);
      } catch (err) {
        console.error('Failed to load featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.append('search', searchKeyword.trim());
    if (locationKeyword.trim()) params.append('location', locationKeyword.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 overflow-hidden">
      {/* Hero Section with Ambient Palette Blobs */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-[#CAD2C5]/30 via-[#F4F7F5] to-[#F4F7F5]">
        {/* Animated Fluid Ambient Blobs in Theme Colors */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#CAD2C5]/40 rounded-full blur-3xl animate-blob pointer-events-none -z-10" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#84A98C]/20 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-[#52796F]/15 rounded-full blur-3xl animate-blob animation-delay-4000 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* Floating Widget 1: Left floating student placement card */}
          <div className="hidden xl:flex items-center gap-3 p-3.5 rounded-2xl glass-panel shadow-lg border border-[#CAD2C5] absolute -left-6 top-16 animate-float z-20 hover:scale-105 transition-transform cursor-default">
            <div className="w-10 h-10 rounded-xl bg-[#354F52] text-[#84A98C] flex items-center justify-center font-bold text-sm shadow-xs border border-[#52796F]">
              🎓
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-extrabold text-[#2F3E46]">Placed at TechCorp</span>
                <span className="w-2 h-2 rounded-full bg-[#52796F] animate-pulse" />
              </div>
              <p className="text-[11px] font-semibold text-[#52796F]">₹7.0 LPA • Class of 2025</p>
            </div>
          </div>

          {/* Floating Widget 2: Right floating 1-Click Apply badge */}
          <div className="hidden xl:flex items-center gap-3 p-3.5 rounded-2xl glass-panel shadow-lg border border-[#CAD2C5] absolute -right-6 top-28 animate-float-reverse z-20 hover:scale-105 transition-transform cursor-default">
            <div className="w-10 h-10 rounded-xl bg-[#354F52] text-[#84A98C] flex items-center justify-center font-bold text-sm shadow-xs border border-[#52796F]">
              <Zap className="w-5 h-5 text-[#84A98C]" />
            </div>
            <div className="text-left">
              <span className="text-xs font-extrabold text-[#2F3E46] block">1-Click Fast Apply</span>
              <p className="text-[11px] text-[#52796F]">Zero experience barriers</p>
            </div>
          </div>

          {/* Top Pill with Shine Animation */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#CAD2C5] shadow-xs text-xs font-semibold text-[#2F3E46] mb-6 badge-shine">
            <span className="w-2 h-2 rounded-full bg-[#52796F] animate-ping" />
            <span>Priority Hiring for 2024, 2025 & 2026 Batch Graduates</span>
            <Sparkles className="w-3.5 h-3.5 text-[#84A98C]" />
          </div>

          {/* Main Shimmering Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2F3E46] tracking-tight leading-[1.12] max-w-4xl mx-auto">
            Launch Your First <span className="text-shine">Tech Career</span> Without 5-Year Experience Roadblocks
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#354F52] max-w-2xl mx-auto leading-relaxed">
            The dedicated career launchpad built strictly for college students, fresh graduates, and junior engineers. Hand-curated entry-level jobs and paid internships from verified employers.
          </p>

          {/* Interactive Search Box */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-8 sm:mt-10 max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl border border-[#CAD2C5] hover:border-[#52796F] hover:ring-4 hover:ring-[#52796F]/10 transition-all flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2.5 w-full sm:flex-1 px-3 py-2 text-left">
              <Search className="w-5 h-5 text-[#52796F] flex-shrink-0 animate-pulse-glow" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Job title, skill (React, Python, SQL), or company"
                className="w-full text-sm font-medium text-[#2F3E46] placeholder-[#52796F]/60 bg-transparent outline-none"
              />
            </div>

            <div className="hidden sm:block w-px h-8 bg-[#CAD2C5]" />

            <div className="flex items-center gap-2.5 w-full sm:w-60 px-3 py-2 text-left">
              <MapPin className="w-5 h-5 text-[#52796F] flex-shrink-0" />
              <input
                type="text"
                value={locationKeyword}
                onChange={(e) => setLocationKeyword(e.target.value)}
                placeholder="City or 'Remote'"
                className="w-full text-sm font-medium text-[#2F3E46] placeholder-[#52796F]/60 bg-transparent outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-2xl bg-[#354F52] hover:bg-[#52796F] text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 flex-shrink-0"
            >
              <span>Explore Openings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#354F52]">
            <span className="font-semibold text-[#2F3E46] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#52796F]" /> Trending:
            </span>
            {['React Developer', 'Full Stack Intern', 'Data Analyst', 'Remote Freshers', 'Pune', 'Bangalore'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-white hover:bg-[#CAD2C5]/40 text-[#354F52] hover:text-[#2F3E46] border border-[#CAD2C5] shadow-xs hover:border-[#84A98C] hover:scale-105 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Animated Metrics Banner */}
          <div className="mt-14 pt-8 border-t border-[#CAD2C5] grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-3 rounded-2xl hover:bg-white/60 transition-colors">
              <p className="text-3xl sm:text-4xl font-black text-[#2F3E46] tracking-tight">
                {freshersCount.toLocaleString()}+
              </p>
              <p className="text-xs font-semibold text-[#354F52] mt-1">Freshers Placed</p>
            </div>
            <div className="p-3 rounded-2xl hover:bg-white/60 transition-colors">
              <p className="text-3xl sm:text-4xl font-black text-[#52796F] tracking-tight">
                {companiesCount}+
              </p>
              <p className="text-xs font-semibold text-[#354F52] mt-1">Hiring Tech Companies</p>
            </div>
            <div className="p-3 rounded-2xl hover:bg-white/60 transition-colors">
              <p className="text-3xl sm:text-4xl font-black text-[#2F3E46] tracking-tight">
                0 - 1 Yr
              </p>
              <p className="text-xs font-semibold text-[#354F52] mt-1">Strict Experience Cap</p>
            </div>
            <div className="p-3 rounded-2xl hover:bg-white/60 transition-colors">
              <p className="text-3xl sm:text-4xl font-black text-[#52796F] tracking-tight">
                ₹6.2 LPA
              </p>
              <p className="text-xs font-semibold text-[#354F52] mt-1">Average Starting CTC</p>
            </div>
          </div>
        </div>

        {/* Live Animated Ticker Marquee */}
        <div className="mt-12 border-y border-[#CAD2C5] bg-[#CAD2C5]/20 backdrop-blur-md py-3 overflow-hidden">
          <div className="flex items-center gap-3 max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#354F52] text-white text-[11px] font-bold border border-[#52796F] flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#84A98C] animate-ping" />
              LIVE FEED
            </div>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div className="inline-flex items-center gap-8 animate-marquee pause-marquee text-xs text-[#354F52] font-medium">
                {HIRING_TICKER.concat(HIRING_TICKER).map((text, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2">
                    <span>{text}</span>
                    <span className="text-[#84A98C]">•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Career Track Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#52796F] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#84A98C]" />
              Curated Specializations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F3E46] mt-1">
              Popular Career Roles for Freshers
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#52796F] hover:text-[#2F3E46] transition-colors group"
          >
            <span>View All Tracks</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  if (cat.query === 'Internship') {
                    navigate('/internships');
                  } else if (cat.query === 'Remote') {
                    navigate('/remote-roles');
                  } else {
                    navigate(`/jobs?search=${encodeURIComponent(cat.query)}`);
                  }
                }}
                className="group relative p-5 rounded-2xl bg-white border border-[#CAD2C5] hover:border-[#84A98C] card-hover-lift text-left flex flex-col justify-between overflow-hidden shadow-xs"
              >
                {/* Subtle hover background */}
                <div className="absolute inset-0 bg-[#CAD2C5]/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-[#CAD2C5]/40 text-[#2F3E46] border border-[#CAD2C5] group-hover:scale-110 flex items-center justify-center transition-all duration-300 mb-3 shadow-xs">
                    <Icon className="w-5 h-5 text-[#354F52]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#2F3E46] group-hover:text-[#52796F] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#52796F] font-medium mt-0.5">{cat.count}</p>
                </div>

                <div className="relative z-10 mt-3 pt-2 border-t border-[#CAD2C5]/60 flex items-center justify-between text-[11px] font-semibold text-[#52796F] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#CAD2C5]/40 text-[#2F3E46] border border-[#CAD2C5] mb-2 badge-shine">
              <Sparkles className="w-3.5 h-3.5 text-[#84A98C]" />
              Verified Early-Career Openings
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F3E46]">
              Featured Opportunities for Fresh Grads
            </h2>
            <p className="text-sm text-[#354F52] mt-1">
              Top tech companies hiring 2024, 2025, and 2026 batches right now
            </p>
          </div>

          <Link
            to="/jobs"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#2F3E46] hover:text-white bg-[#84A98C] hover:bg-[#52796F] border border-[#52796F]/40 transition-all self-start sm:self-auto shadow-xs"
          >
            Explore All Jobs ({featuredJobs.length}+)
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-[#CAD2C5]/30 animate-pulse border border-[#CAD2C5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div key={job._id} className="card-hover-lift">
                <JobCard
                  job={job}
                  onApply={(j) => setSelectedJobForApply(j)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it Works Step-by-Step in #2F3E46 Dark Container */}
      <section className="bg-[#2F3E46] text-white py-16 sm:py-24 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden shadow-2xl border border-[#354F52]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#52796F]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#84A98C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#84A98C] flex items-center justify-center gap-1.5 mb-2">
            <TrendingUp className="w-4 h-4" />
            Fast-Track Early Career Program
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How Freshers Land Offers on FresherJobs
          </h2>
          <p className="text-sm text-[#CAD2C5] mt-2">
            No endless resume black holes. Straightforward stages designed for modern early-career engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Step 1 */}
          <div className="bg-[#354F52] rounded-3xl p-7 border border-[#52796F] flex flex-col items-start hover:border-[#84A98C] hover:bg-[#3d595c] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-[#2F3E46] border border-[#52796F] text-[#84A98C] flex items-center justify-center font-black text-lg mb-5 shadow-sm group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#CAD2C5] transition-colors">
              Build Your Fresher Profile
            </h3>
            <p className="text-xs text-[#CAD2C5]/90 leading-relaxed">
              Add your college degree, graduation batch, GitHub & portfolio links, technical skills, and upload your resume once.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#354F52] rounded-3xl p-7 border border-[#52796F] flex flex-col items-start hover:border-[#84A98C] hover:bg-[#3d595c] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-[#2F3E46] border border-[#52796F] text-[#84A98C] flex items-center justify-center font-black text-lg mb-5 shadow-sm group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#CAD2C5] transition-colors">
              1-Click Fast Applications
            </h3>
            <p className="text-xs text-[#CAD2C5]/90 leading-relaxed">
              Filter openings by batch, salary, and remote preferences. Apply in 10 seconds with a custom pitch for the hiring team.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#354F52] rounded-3xl p-7 border border-[#52796F] flex flex-col items-start hover:border-[#84A98C] hover:bg-[#3d595c] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-[#2F3E46] border border-[#52796F] text-[#84A98C] flex items-center justify-center font-black text-lg mb-5 shadow-sm group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#CAD2C5] transition-colors">
              Real-Time Status & Interviews
            </h3>
            <p className="text-xs text-[#CAD2C5]/90 leading-relaxed">
              Track when recruiters review your application, view interview links (Google Meet/Zoom), and receive direct job offers.
            </p>
          </div>
        </div>

        <div className="mt-14 text-center relative z-10">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#84A98C] hover:bg-[#52796F] text-[#2F3E46] hover:text-white font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <span>Create Free Seeker Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Recruiter Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#CAD2C5]/25 border border-[#CAD2C5] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#52796F] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#52796F]" />
              For Employers & Campus Teams
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F3E46]">
              Hiring 2024 - 2026 Campus Graduates?
            </h2>
            <p className="text-sm text-[#354F52] leading-relaxed">
              Reach thousands of pre-vetted college graduates and engineering students ready for immediate joining. Post jobs, review resumes, and schedule interviews seamlessly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <Link
              to="/register?role=recruiter"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white font-bold text-xs shadow-md transition-all text-center"
            >
              Start Hiring Freshers
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#CAD2C5]/30 border border-[#52796F] text-[#2F3E46] font-bold text-xs transition-colors text-center"
            >
              Recruiter Login
            </Link>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
      />
    </div>
  );
};

export default Home;
