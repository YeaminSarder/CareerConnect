import Router from 'express';
import CvController from '../controllers/cv.js';
import requireAuth from '../middleware/require-auth.js';
import uploadCv from '../middleware/upload-cv.js';

const router = Router();
console.log(CvController.createCv)
router.use(requireAuth);

router.get('/', CvController.getMyCvs);
//router.post('/', CvController.createCv);
router.param('id', CvController.validateCvId);
router.patch('/:id', CvController.updateCv);
router.patch('/:id/set-primary', CvController.setPrimaryCv);
router.get('/:id/file',(req,res, next) => {
    console.log("getCvFile", req.cv.file.path, req.cv.file.mimeType)
    next()
},CvController.getCvFile)
router.get('/:id', CvController.getCvById);
router.delete('/:id', CvController.deleteCv);
router.post('/', CvController.createCvFromFile);
export default router;