import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';

// @desc    Get all jobs with search, filters, pagination
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      jobType,
      workplaceType,
      experienceLevel,
      batch,
      location,
      minSalary,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const query = { status: 'active' };

    // Search keyword across title, companyName, skills, location, description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { companyName: searchRegex },
        { location: searchRegex },
        { skills: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filters
    if (jobType && jobType !== 'All') {
      const types = jobType.split(',').map(t => t.trim());
      const typesRegex = types.map(t => new RegExp(`^${t}$`, 'i'));
      query.jobType = { $in: typesRegex };
    }

    if (workplaceType && workplaceType !== 'All') {
      const types = workplaceType.split(',').map(t => t.trim());
      const typesRegex = types.map(t => new RegExp(`^${t}$`, 'i'));
      const isRemote = types.some(t => t.toLowerCase() === 'remote');

      if (isRemote && types.length === 1) {
        const remoteFilter = {
          $or: [
            { workplaceType: { $in: typesRegex } },
            { location: /remote/i }
          ]
        };
        if (query.$or) {
          query.$and = [{ $or: query.$or }, remoteFilter];
          delete query.$or;
        } else {
          query.$or = remoteFilter.$or;
        }
      } else {
        query.workplaceType = { $in: typesRegex };
      }
    }

    if (experienceLevel && experienceLevel !== 'All') {
      const levels = experienceLevel.split(',').map(l => l.trim());
      query.experienceLevel = { $in: levels };
    }

    if (batch && batch !== 'All') {
      query.eligibleBatches = { $in: [batch, 'Any Batch', 'All Batches'] };
    }

    if (location && location.trim() !== '' && location !== 'All') {
      query.location = new RegExp(location.trim(), 'i');
    }

    if (minSalary && !isNaN(Number(minSalary))) {
      query['salary.max'] = { $gte: Number(minSalary) };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest first
    if (sort === 'salary-high') {
      sortOption = { 'salary.max': -1 };
    } else if (sort === 'salary-low') {
      sortOption = { 'salary.min': 1 };
    } else if (sort === 'popular') {
      sortOption = { applicationsCount: -1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo website industry location verified')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured jobs for homepage
// @route   GET /api/jobs/featured
// @access  Public
export const getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'active', isFeatured: true })
      .populate('company', 'name logo website industry location')
      .limit(6)
      .sort({ createdAt: -1 });

    // Fallback if not enough featured jobs
    if (jobs.length < 6) {
      const remaining = 6 - jobs.length;
      const additional = await Job.find({ status: 'active', isFeatured: false })
        .populate('company', 'name logo website industry location')
        .limit(remaining)
        .sort({ createdAt: -1 });
      jobs.push(...additional);
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get internship jobs
// @route   GET /api/jobs/internships
// @access  Public
export const getInternshipJobs = async (req, res, next) => {
  req.query.jobType = 'Internship';
  return getJobs(req, res, next);
};

// @desc    Get remote jobs
// @route   GET /api/jobs/remote
// @access  Public
export const getRemoteJobs = async (req, res, next) => {
  req.query.workplaceType = 'Remote';
  return getJobs(req, res, next);
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('postedBy', 'name email phone avatar recruiterProfile');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter)
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      skills,
      jobType,
      workplaceType,
      experienceLevel,
      eligibleBatches,
      location,
      salary,
      openings,
      deadline,
      isFeatured
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, and location' });
    }

    // Get recruiter's company
    let company = await Company.findOne({ createdBy: req.user._id });
    if (!company && req.user.recruiterProfile?.company) {
      company = await Company.findById(req.user.recruiterProfile.company);
    }

    if (!company) {
      // Auto-create company from user profile if not yet created
      company = await Company.create({
        name: req.user.recruiterProfile?.companyName || `${req.user.name}'s Tech`,
        location: location || 'Bangalore, India',
        createdBy: req.user._id
      });
    }

    const job = await Job.create({
      title,
      company: company._id,
      companyName: company.name,
      companyLogo: company.logo || '',
      postedBy: req.user._id,
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n').filter(Boolean) : []),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : []),
      jobType: jobType || 'Full-time',
      workplaceType: workplaceType || 'Remote',
      experienceLevel: experienceLevel || 'Fresher (0-1 yrs)',
      eligibleBatches: Array.isArray(eligibleBatches) ? eligibleBatches : (eligibleBatches ? eligibleBatches.split(',').map(b => b.trim()) : ['2024', '2025', '2026']),
      location,
      salary: salary || { min: 300000, max: 600000, currency: 'INR', period: 'per year', isDisclosed: true },
      openings: openings || 1,
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isFeatured: Boolean(isFeatured)
    });

    res.status(201).json({
      success: true,
      job,
      message: 'Job posted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter / Admin)
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user is owner or admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job posting' });
    }

    const {
      title,
      description,
      requirements,
      responsibilities,
      skills,
      jobType,
      workplaceType,
      experienceLevel,
      eligibleBatches,
      location,
      salary,
      openings,
      deadline,
      status,
      isFeatured
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (requirements !== undefined) {
      job.requirements = Array.isArray(requirements) ? requirements : requirements.split('\n').filter(Boolean);
    }
    if (responsibilities !== undefined) {
      job.responsibilities = Array.isArray(responsibilities) ? responsibilities : responsibilities.split('\n').filter(Boolean);
    }
    if (skills !== undefined) {
      job.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (jobType) job.jobType = jobType;
    if (workplaceType) job.workplaceType = workplaceType;
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (eligibleBatches !== undefined) {
      job.eligibleBatches = Array.isArray(eligibleBatches) ? eligibleBatches : eligibleBatches.split(',').map(b => b.trim());
    }
    if (location) job.location = location;
    if (salary) job.salary = { ...job.salary, ...salary };
    if (openings !== undefined) job.openings = openings;
    if (deadline) job.deadline = deadline;
    if (status) job.status = status;
    if (isFeatured !== undefined) job.isFeatured = isFeatured;

    await job.save();

    res.status(200).json({
      success: true,
      job,
      message: 'Job posting updated successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter / Admin)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job posting' });
    }

    // Delete related applications
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job posting and associated applications removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by current recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter)
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate('company', 'name logo')
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
