import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide job description']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  jobType: {
    type: String,
    enum: ['Full-time', 'Internship', 'Part-time', 'Contract'],
    default: 'Full-time'
  },
  workplaceType: {
    type: String,
    enum: ['Remote', 'Hybrid', 'On-site'],
    default: 'Remote'
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher (0-1 yrs)', '0-2 yrs', 'Internship'],
    default: 'Fresher (0-1 yrs)'
  },
  eligibleBatches: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: [true, 'Please provide job location'],
    trim: true
  },
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    period: { type: String, enum: ['per month', 'per year'], default: 'per year' },
    isDisclosed: { type: Boolean, default: true }
  },
  openings: {
    type: Number,
    default: 1
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  applicationsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Text index for search
jobSchema.index({
  title: 'text',
  companyName: 'text',
  location: 'text',
  skills: 'text',
  description: 'text'
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
