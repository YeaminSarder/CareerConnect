import Router from 'express';
import CvController from '../controllers/cv.js';
import requireAuth from '../middleware/require-auth.js';

const router = Router();
console.log(CvController.createCv)
router.use(requireAuth);

router.get('/', CvController.getMyCvs);
router.post('/', CvController.createCv);
router.param('id', CvController.validateCvId);
router.patch('/:id', CvController.updateCv);
router.patch('/:id/set-primary', CvController.setPrimaryCv);
router.get('/:id', CvController.getCvById);
router.delete('/:id', CvController.deleteCv);


export default router;