import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#CAD2C5] shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#CAD2C5]/30 text-[#2F3E46] border border-[#CAD2C5] flex items-center justify-center mx-auto text-2xl font-extrabold">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-[#2F3E46]">Page Not Found</h1>
        <p className="text-xs text-[#354F52]">
          The page you are looking for might have been moved or does not exist.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#354F52] text-white text-xs font-semibold hover:bg-[#52796F] transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Back Home
          </Link>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#84A98C] hover:bg-[#52796F] text-[#2F3E46] hover:text-white border border-[#52796F]/40 text-xs font-semibold transition-colors"
          >
            <Search className="w-3.5 h-3.5" /> Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
