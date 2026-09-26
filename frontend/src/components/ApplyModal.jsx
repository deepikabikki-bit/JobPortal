import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../services/api';
import {
  X,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Send,
  PartyPopper
} from 'lucide-react';

const ApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated, isSeeker } = useAuth();
  const navigate = useNavigate();

  const [useSavedResume, setUseSavedResume] = useState(true);
  const [newResumeFile, setNewResumeFile] = useState(null);
  const [coverNote, setCoverNote] = useState(
    `Dear Hiring Team at ${job?.companyName || 'your company'},\n\nI am very excited to apply for the ${job?.title || 'Fresher'} opening. As a fresh graduate with solid fundamentals and relevant academic projects, I am passionate about learning and contributing to your team's success.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const hasSavedResume = !!user?.seekerProfile?.resume?.url;

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate(`/login?redirect=/jobs/${job._id}`);
      return;
    }

    if (!isSeeker) {
      setError('Only candidates registered as Job Seekers (Freshers) can submit applications.');
      return;
    }

    if (!useSavedResume && !newResumeFile && !hasSavedResume) {
      setError('Please upload your resume to apply.');
      return;
    }

    setSubmitting(true);

    try {
      if (newResumeFile && !useSavedResume) {
        const formData = new FormData();
        formData.append('resume', newResumeFile);
        formData.append('coverNote', coverNote);
        await applicationsAPI.applyForJob(job._id, formData);
      } else {
        await applicationsAPI.applyForJob(job._id, {
          coverNote,
          resumeUrl: user?.seekerProfile?.resume?.url,
          resumeName: user?.seekerProfile?.resume?.originalName
        });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2F3E46]/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#CAD2C5] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#52796F] hover:text-[#2F3E46] hover:bg-[#CAD2C5]/30 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-10 text-center space-y-4 relative">
            <div className="absolute top-0 left-8 text-2xl animate-float">🎉</div>
            <div className="absolute top-4 right-10 text-2xl animate-float-reverse">🚀</div>
            <div className="absolute bottom-2 left-12 text-2xl animate-float-slow">✨</div>
            <div className="absolute bottom-6 right-8 text-2xl animate-float">🎓</div>

            <div className="w-20 h-20 bg-[#354F52] text-[#84A98C] rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-[#52796F] animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#CAD2C5]/40 text-[#2F3E46] border border-[#52796F]">
                <PartyPopper className="w-3.5 h-3.5 text-[#52796F]" /> Direct Submission Complete!
              </span>
              <h3 className="text-2xl font-black text-[#2F3E46]">Application Sent!</h3>
              <p className="text-xs sm:text-sm text-[#354F52] max-w-sm mx-auto leading-relaxed">
                Your profile and credentials were successfully delivered to the campus recruiters at <strong>{job.companyName}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#CAD2C5]/30 text-[#354F52] border border-[#CAD2C5] mb-2 badge-shine">
                <Sparkles className="w-3.5 h-3.5 text-[#84A98C]" />
                Direct Fresher Application
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2F3E46]">
                Apply for {job.title}
              </h2>
              <p className="text-xs text-[#52796F] mt-1 font-medium">
                {job.companyName} • {job.location} • {job.jobType}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!isAuthenticated ? (
              <div className="py-6 text-center space-y-4">
                <p className="text-sm text-[#354F52]">
                  Please log in to your Fresher account to submit your application with one click.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => navigate(`/login?redirect=/jobs/${job._id}`)}
                    className="px-5 py-2.5 rounded-xl bg-[#354F52] text-white font-semibold text-sm hover:bg-[#52796F] shadow-sm transition-all hover:scale-105"
                  >
                    Log In to Apply
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-5 py-2.5 rounded-xl border border-[#52796F] text-[#354F52] font-semibold text-sm hover:bg-[#CAD2C5]/30 transition-colors"
                  >
                    Register as Fresher
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                {/* Resume Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-2">
                    Resume / CV
                  </label>

                  {hasSavedResume ? (
                    <div className="space-y-2">
                      <div
                        onClick={() => setUseSavedResume(true)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          useSavedResume
                            ? 'border-[#52796F] bg-[#CAD2C5]/20 ring-2 ring-[#52796F]/30 shadow-xs'
                            : 'border-[#CAD2C5] hover:border-[#52796F]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#CAD2C5]/40 text-[#2F3E46] flex items-center justify-center">
                            <FileText className="w-4 h-4 text-[#354F52]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#2F3E46]">
                              {user.seekerProfile.resume.originalName || 'Default Profile Resume'}
                            </p>
                            <p className="text-[10px] text-[#52796F]">From your saved profile</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="resumeOption"
                          checked={useSavedResume}
                          onChange={() => setUseSavedResume(true)}
                          className="text-[#354F52] focus:ring-[#52796F]"
                        />
                      </div>

                      <div
                        onClick={() => setUseSavedResume(false)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          !useSavedResume
                            ? 'border-[#52796F] bg-[#CAD2C5]/20 ring-2 ring-[#52796F]/30 shadow-xs'
                            : 'border-[#CAD2C5] hover:border-[#52796F]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#F4F7F5] text-[#52796F] flex items-center justify-center">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold text-[#354F52]">
                            Upload a different resume (PDF / DOCX)
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="resumeOption"
                          checked={!useSavedResume}
                          onChange={() => setUseSavedResume(false)}
                          className="text-[#354F52] focus:ring-[#52796F]"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#52796F] mb-2 font-medium">
                      No resume uploaded yet in your profile. Please select a file below:
                    </p>
                  )}

                  {(!hasSavedResume || !useSavedResume) && (
                    <div className="mt-2">
                      <label className="border-2 border-dashed border-[#CAD2C5] hover:border-[#52796F] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F4F7F5] hover:bg-[#CAD2C5]/20 text-center">
                        <Upload className="w-7 h-7 text-[#52796F] mb-1" />
                        <span className="text-xs font-bold text-[#2F3E46]">
                          {newResumeFile ? newResumeFile.name : 'Click to browse PDF or Word file'}
                        </span>
                        <span className="text-[10px] text-[#52796F] mt-0.5">Max 10MB</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setNewResumeFile(e.target.files[0]);
                              setUseSavedResume(false);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Pitch / Cover Note */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2F3E46] mb-1.5">
                    Cover Note / Quick Pitch for Recruiter
                  </label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full text-xs rounded-2xl border border-[#CAD2C5] p-3.5 text-[#2F3E46] focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none leading-relaxed bg-[#F4F7F5]/50"
                    placeholder="Introduce yourself, highlight your college projects or skills..."
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#52796F] hover:bg-[#CAD2C5]/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#354F52] hover:bg-[#52796F] shadow-sm disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Confirm & Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
