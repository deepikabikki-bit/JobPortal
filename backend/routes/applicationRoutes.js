import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/:jobId', protect, authorize('seeker'), upload.single('resume'), applyForJob);
router.get('/my-applications', protect, authorize('seeker'), getMyApplications);
router.get('/recruiter/candidates', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('seeker'), withdrawApplication);

export default router;
