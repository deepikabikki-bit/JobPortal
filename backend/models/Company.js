import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
    unique: true
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  industry: {
    type: String,
    trim: true,
    default: 'Software & Technology'
  },
  location: {
    type: String,
    trim: true,
    required: [true, 'Please provide company location']
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    default: '11-50'
  },
  foundedYear: {
    type: Number,
    default: new Date().getFullYear()
  },
  verified: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);

export default Company;
