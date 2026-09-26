import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  GraduationCap,
  Building2,
  ShieldCheck
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      // Route based on role if no specific redirect was requested
      if (redirect && redirect !== '/') {
        navigate(redirect);
      } else if (data.user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click Demo Fill
  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#CAD2C5] shadow-xl relative overflow-hidden">
        {/* Subtle decorative theme gradient top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2F3E46] via-[#354F52] to-[#52796F]" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#CAD2C5]/30 text-[#354F52] border border-[#CAD2C5] flex items-center justify-center mx-auto shadow-xs">
            <Briefcase className="w-6 h-6 text-[#354F52]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#2F3E46] tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs text-[#52796F]">
            Sign in to access your fresher profile or hiring dashboard
          </p>
        </div>

        {/* Demo Fast Access Buttons */}
        <div className="bg-[#F4F7F5] rounded-2xl p-3 border border-[#CAD2C5]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#52796F]">
              ⚡ 1-Click Demo Login
            </span>
            <span className="text-[10px] text-[#354F52] font-semibold">Pre-filled Test Users</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => fillDemo('fresher@example.com', 'seekerpassword123')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-[#CAD2C5]/30 border border-[#CAD2C5] font-semibold text-[#2F3E46] hover:text-[#52796F] flex flex-col items-center gap-1 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-[#52796F]" />
              <span>Fresher</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('recruiter@techcorp.com', 'recruiterpassword123')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-[#CAD2C5]/30 border border-[#CAD2C5] font-semibold text-[#2F3E46] hover:text-[#52796F] flex flex-col items-center gap-1 transition-colors"
            >
              <Building2 className="w-4 h-4 text-[#52796F]" />
              <span>Recruiter</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@fresherjobs.com', 'adminpassword123')}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-[#CAD2C5]/30 border border-[#CAD2C5] font-semibold text-[#2F3E46] hover:text-[#52796F] flex flex-col items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#52796F]" />
              <span>Admin</span>
            </button>
          </div>
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
              Email Address
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2F3E46]">
                Password
              </label>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#354F52] hover:bg-[#52796F] text-white font-bold text-xs tracking-wide uppercase shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#354F52] pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#52796F] hover:text-[#2F3E46] underline">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
