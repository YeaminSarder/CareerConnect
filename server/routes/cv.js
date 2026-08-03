import Router from 'express';
import CvController from '../controllers/cv.js';
import requireAuth from '../middleware/require-auth.js';

const router = Router();
console.log(CvController.createCv)
router.use(requireAuth);

router.get('/', CvController.getMyCvs);
router.post('/', CvController.createCv);
router.patch('/:id', CvController.updateCv);
router.param('id', CvController.validateCvId);
router.get('/:id', CvController.getCvById);
router.delete('/:id', CvController.deleteCv);

export default router;