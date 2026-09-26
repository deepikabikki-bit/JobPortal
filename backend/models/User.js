import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const educationSchema = new mongoose.Schema({
  degree: { type: String, trim: true },
  fieldOfStudy: { type: String, trim: true },
  institution: { type: String, trim: true },
  graduationYear: { type: String, trim: true },
  cgpaPercentage: { type: String, trim: true }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['seeker', 'recruiter', 'admin'],
    default: 'seeker'
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },

  // Job Seeker (Fresher) specific profile
  seekerProfile: {
    headline: { type: String, default: '' },
    graduationBatch: { type: String, default: '' }, // e.g., '2024', '2025', '2026'
    skills: [{ type: String, trim: true }],
    education: [educationSchema],
    resume: {
      filename: { type: String, default: '' },
      url: { type: String, default: '' },
      originalName: { type: String, default: '' },
      uploadedAt: { type: Date }
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Internship Experience', '0-1 Year', '1-2 Years'],
      default: 'Fresher'
    },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    preferredJobType: [{ type: String }], // 'Full-time', 'Internship', 'Remote'
    expectedSalary: { type: String, default: '' }
  },

  // Recruiter specific profile
  recruiterProfile: {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    companyName: { type: String, default: '' },
    designation: { type: String, default: 'HR Manager' }
  }
}, {
  timestamps: true
});

// Encrypt password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password match method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
