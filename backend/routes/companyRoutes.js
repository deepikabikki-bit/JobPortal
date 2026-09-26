import express from 'express';
import {
  getCompanies,
  getCompanyById,
  getMyCompany,
  createOrUpdateCompany,
  uploadCompanyLogo
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCompanies);
router.get('/my-company', protect, authorize('recruiter', 'admin'), getMyCompany);
router.get('/:id', getCompanyById);
router.post('/', protect, authorize('recruiter', 'admin'), createOrUpdateCompany);
router.post('/logo', protect, authorize('recruiter', 'admin'), upload.single('logo'), uploadCompanyLogo);

export default router;
