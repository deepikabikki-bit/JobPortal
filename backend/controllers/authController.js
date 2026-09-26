import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fresher_job_portal_super_jwt_secret_token_2026_xyz', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new user (Seeker or Recruiter)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, location, headline, graduationBatch, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const assignedRole = ['seeker', 'recruiter'].includes(role) ? role : 'seeker';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      seekerProfile: assignedRole === 'seeker' ? {
        headline: headline || 'Fresher Job Seeker',
        graduationBatch: graduationBatch || '2025',
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
      } : undefined,
      recruiterProfile: assignedRole === 'recruiter' ? {
        companyName: companyName || `${name}'s Company`,
        designation: 'Hiring Manager'
      } : undefined
    });

    // If recruiter, automatically create or link company
    if (assignedRole === 'recruiter') {
      const existingCompany = await Company.findOne({ name: companyName || `${name}'s Company` });
      let companyId;

      if (existingCompany) {
        companyId = existingCompany._id;
      } else {
        const newCompany = await Company.create({
          name: companyName || `${name} Technologies`,
          location: location || 'Bangalore, India',
          description: `Welcome to ${companyName || name}'s recruiting team.`,
          createdBy: user._id
        });
        companyId = newCompany._id;
      }

      user.recruiterProfile.company = companyId;
      await user.save();
    }

    const token = generateToken(user._id);

    // Fetch user without password
    const safeUser = await User.findById(user._id).populate('recruiterProfile.company');

    res.status(201).json({
      success: true,
      token,
      user: safeUser,
      message: 'Registration successful!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password').populate('recruiterProfile.company');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact administrator.' });
    }

    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user,
      message: 'Logged in successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('recruiterProfile.company');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, bio, avatar, seekerProfile, recruiterProfile } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    if (user.role === 'seeker' && seekerProfile) {
      user.seekerProfile = {
        ...user.seekerProfile.toObject(),
        ...seekerProfile
      };
    }

    if (user.role === 'recruiter' && recruiterProfile) {
      user.recruiterProfile = {
        ...user.recruiterProfile.toObject(),
        ...recruiterProfile
      };
    }

    await user.save();

    const updatedUser = await User.findById(user._id).populate('recruiterProfile.company');

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/auth/upload-resume
// @access  Private (Seeker)
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    user.seekerProfile.resume = {
      filename: req.file.filename,
      url: resumeUrl,
      originalName: req.file.originalname,
      uploadedAt: new Date()
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: user.seekerProfile.resume
    });
  } catch (error) {
    next(error);
  }
};
