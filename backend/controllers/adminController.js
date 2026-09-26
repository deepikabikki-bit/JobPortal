import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSeekers = await User.countDocuments({ role: 'seeker' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();

    // Recent 5 applications
    const recentApplications = await Application.find()
      .populate('job', 'title companyName')
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSeekers,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        totalCompanies
      },
      recentApplications,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search & role filter
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;

    const query = {};
    if (role && role !== 'All') query.role = role;
    if (status && status !== 'All') query.status = status;
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Suspended)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot suspend admin accounts' });
    }

    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();

    res.status(200).json({
      success: true,
      user,
      message: `User status changed to ${user.status}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin account' });
    }

    // Clean up applications or jobs if any
    if (user.role === 'seeker') {
      await Application.deleteMany({ applicant: user._id });
    } else if (user.role === 'recruiter') {
      await Job.deleteMany({ postedBy: user._id });
      await Application.deleteMany({ recruiter: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and associated data removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for admin management
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllAdminJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email')
      .populate('company', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured job
// @route   PUT /api/admin/jobs/:id/featured
// @access  Private (Admin)
export const toggleJobFeatured = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.isFeatured = !job.isFeatured;
    await job.save();

    res.status(200).json({
      success: true,
      job,
      message: `Job is now ${job.isFeatured ? 'featured' : 'standard'}`
    });
  } catch (error) {
    next(error);
  }
};
