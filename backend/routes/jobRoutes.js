import express from 'express';
import {
  getJobs,
  getInternshipJobs,
  getRemoteJobs,
  getFeaturedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/internships', getInternshipJobs);
router.get('/remote', getRemoteJobs);
router.get('/featured', getFeaturedJobs);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getMyJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;
