import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  User,
  Mail,
  Lock,
  GraduationCap,
  Building2,
  MapPin,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'seeker';

  const { register } = useAuth();
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Seeker specific fields
  const [graduationBatch, setGraduationBatch] = useState('2025');
  const [skills, setSkills] = useState('React, JavaScript, HTML, CSS');
  const [headline, setHeadline] = useState('Aspiring Software Engineer');

  // Recruiter specific fields
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('Bengaluru, India');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === 'seeker'
          ? {
              graduationBatch,
              skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
              headline
            }
          : {
              companyName: companyName || `${name}'s Company`,
              location
            })
      };

      await register(payload);
      if (role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#CAD2C5] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2F3E46] via-[#354F52] to-[#52796F]" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#CAD2C5]/30 text-[#354F52] border border-[#CAD2C5] flex items-center justify-center mx-auto shadow-xs">
            <Briefcase className="w-6 h-6 text-[#354F52]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#2F3E46] tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-[#52796F]">
            Join thousands of freshers and hiring recruiters today
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F4F7F5] rounded-2xl border border-[#CAD2C5]">
          <button
            type="button"
            onClick={() => setRole('seeker')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'seeker'
                ? 'bg-[#354F52] text-white shadow-xs'
                : 'text-[#52796F] hover:text-[#2F3E46]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>I'm a Fresher</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'recruiter'
                ? 'bg-[#354F52] text-white shadow-xs'
                : 'text-[#52796F] hover:text-[#2F3E46]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>I'm a Recruiter</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#52796F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={role === 'seeker' ? 'e.g. Rahul Sharma' : 'e.g. Ananya Deshmukh'}
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] placeholder-[#52796F]/60 focus:ring-2 focus:ring-[#52796F]/20 focus:border-[#52796F] outline-none bg-[#F4F7F5]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
              {role === 'recruiter' ? 'Work Email Address' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#52796F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] placeholder-[#52796F]/60 focus:ring-2 focus:ring-[#52796F]/20 focus:border-[#52796F] outline-none bg-[#F4F7F5]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#52796F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] placeholder-[#52796F]/60 focus:ring-2 focus:ring-[#52796F]/20 focus:border-[#52796F] outline-none bg-[#F4F7F5]/50"
              />
            </div>
          </div>

          {/* Conditional Seeker Fields */}
          {role === 'seeker' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                    Graduation Batch
                  </label>
                  <select
                    value={graduationBatch}
                    onChange={(e) => setGraduationBatch(e.target.value)}
                    className="w-full text-xs px-3 py-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] bg-[#F4F7F5]/50 outline-none focus:border-[#52796F]"
                  >
                    <option value="2023">2023 Batch</option>
                    <option value="2024">2024 Batch</option>
                    <option value="2025">2025 Batch</option>
                    <option value="2026">2026 Batch</option>
                    <option value="2027">2027 Batch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                    Primary Track / Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Frontend React Fresher"
                    className="w-full text-xs px-3 py-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] placeholder-[#52796F]/60 outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                  Key Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React.js, Python, SQL, Git"
                  className="w-full text-xs px-3 py-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] placeholder-[#52796F]/60 outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                />
              </div>
            </>
          )}

          {/* Conditional Recruiter Fields */}
          {role === 'recruiter' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#52796F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="e.g. Acme Innovations Pvt Ltd"
                    className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] placeholder-[#52796F]/60 outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                  Company Headquarters
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#52796F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-[#CAD2C5] text-[#2F3E46] placeholder-[#52796F]/60 outline-none focus:border-[#52796F] bg-[#F4F7F5]/50"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white font-bold text-xs tracking-wide uppercase shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 pt-3 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#354F52]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#52796F] hover:text-[#2F3E46] underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
