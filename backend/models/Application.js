import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    filename: { type: String, default: '' },
    url: { type: String, default: '' },
    originalName: { type: String, default: '' }
  },
  coverNote: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'],
    default: 'Applied'
  },
  statusHistory: [{
    status: { type: String },
    note: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now }
  }],
  interviewDetails: {
    date: { type: Date },
    mode: { type: String, enum: ['Google Meet', 'Zoom', 'In-Person', 'Phone Call', 'Online Test'], default: 'Google Meet' },
    linkOrVenue: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  recruiterNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
