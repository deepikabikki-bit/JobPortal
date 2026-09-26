import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllAdminJobs,
  toggleJobFeatured
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require Admin role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllAdminJobs);
router.put('/jobs/:id/featured', toggleJobFeatured);

export default router;
