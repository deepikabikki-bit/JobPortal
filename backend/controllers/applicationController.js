import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Seeker)
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverNote, resumeUrl, resumeName } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This job posting is no longer accepting applications' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Determine resume
    let resume = {
      filename: '',
      url: '',
      originalName: ''
    };

    if (req.file) {
      resume = {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname
      };
    } else if (resumeUrl) {
      resume = {
        filename: '',
        url: resumeUrl,
        originalName: resumeName || 'Resume.pdf'
      };
    } else if (req.user.seekerProfile?.resume?.url) {
      resume = req.user.seekerProfile.resume;
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      recruiter: job.postedBy,
      resume,
      coverNote: coverNote || '',
      status: 'Applied',
      statusHistory: [{
        status: 'Applied',
        note: 'Application submitted successfully',
        updatedAt: new Date()
      }]
    });

    // Increment applications count on job
    job.applicationsCount += 1;
    await job.save();

    res.status(201).json({
      success: true,
      application,
      message: 'Application submitted successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seeker's own applications
// @route   GET /api/applications/my-applications
// @access  Private (Seeker)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        select: 'title companyName companyLogo location jobType workplaceType salary deadline status',
        populate: {
          path: 'company',
          select: 'name logo industry'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for recruiter's jobs
// @route   GET /api/applications/recruiter/candidates
// @access  Private (Recruiter / Admin)
export const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId, status } = req.query;

    let query = {};
    if (req.user.role === 'recruiter') {
      query.recruiter = req.user._id;
    }

    if (jobId) {
      query.job = jobId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('job', 'title location jobType workplaceType')
      .populate('applicant', 'name email phone avatar seekerProfile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Shortlist, Reject, Schedule Interview, Hire)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter / Admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, recruiterNotes, interviewDetails } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job', 'title companyName')
      .populate('applicant', 'name email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify recruiter owns this job application (or admin)
    if (application.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    if (status) {
      application.status = status;
      application.statusHistory.push({
        status,
        note: recruiterNotes || `Status updated to ${status}`,
        updatedAt: new Date()
      });
    }

    if (recruiterNotes !== undefined) {
      application.recruiterNotes = recruiterNotes;
    }

    if (interviewDetails) {
      application.interviewDetails = {
        ...application.interviewDetails,
        ...interviewDetails
      };
    }

    await application.save();

    res.status(200).json({
      success: true,
      application,
      message: `Application marked as ${status}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Seeker)
export const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to withdraw this application' });
    }

    await Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } });
    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    next(error);
  }
};
