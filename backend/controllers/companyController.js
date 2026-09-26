import Company from '../models/Company.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    // Attach active jobs count to each company
    const companiesWithJobs = await Promise.all(companies.map(async (company) => {
      const activeJobsCount = await Job.countDocuments({ company: company._id, status: 'active' });
      return {
        ...company.toObject(),
        activeJobsCount
      };
    }));

    res.status(200).json({
      success: true,
      count: companiesWithJobs.length,
      companies: companiesWithJobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company by ID with its jobs
// @route   GET /api/companies/:id
// @access  Public
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company._id, status: 'active' });

    res.status(200).json({
      success: true,
      company,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current recruiter's company
// @route   GET /api/companies/my-company
// @access  Private (Recruiter)
export const getMyCompany = async (req, res, next) => {
  try {
    let company = await Company.findOne({ createdBy: req.user._id });

    if (!company && req.user.recruiterProfile?.company) {
      company = await Company.findById(req.user.recruiterProfile.company);
    }

    res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update recruiter's company
// @route   POST /api/companies
// @access  Private (Recruiter / Admin)
export const createOrUpdateCompany = async (req, res, next) => {
  try {
    const { name, website, description, industry, location, companySize, foundedYear } = req.body;

    let company = await Company.findOne({ createdBy: req.user._id });

    if (company) {
      if (name) company.name = name;
      if (website !== undefined) company.website = website;
      if (description !== undefined) company.description = description;
      if (industry) company.industry = industry;
      if (location) company.location = location;
      if (companySize) company.companySize = companySize;
      if (foundedYear) company.foundedYear = foundedYear;
      await company.save();
    } else {
      company = await Company.create({
        name: name || `${req.user.name}'s Company`,
        website,
        description,
        industry: industry || 'Software & Technology',
        location: location || 'Bangalore, India',
        companySize: companySize || '11-50',
        foundedYear: foundedYear || new Date().getFullYear(),
        createdBy: req.user._id
      });

      // Update user recruiterProfile
      await User.findByIdAndUpdate(req.user._id, {
        'recruiterProfile.company': company._id,
        'recruiterProfile.companyName': company.name
      });
    }

    res.status(200).json({
      success: true,
      company,
      message: 'Company profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload company logo
// @route   POST /api/companies/logo
// @access  Private (Recruiter / Admin)
export const uploadCompanyLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const logoUrl = `/uploads/${req.file.filename}`;
    let company = await Company.findOne({ createdBy: req.user._id });

    if (!company) {
      company = await Company.create({
        name: `${req.user.name}'s Enterprise`,
        logo: logoUrl,
        location: 'Remote',
        createdBy: req.user._id
      });
    } else {
      company.logo = logoUrl;
      await company.save();
    }

    // Also update companyLogo in all jobs posted by this company
    await Job.updateMany({ company: company._id }, { companyLogo: logoUrl });

    res.status(200).json({
      success: true,
      logoUrl,
      message: 'Company logo uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};
