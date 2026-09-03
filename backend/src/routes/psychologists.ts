import { Router } from 'express';
import { getPsychologist, listPsychologists } from '../controllers/psychologists';

const router = Router();

router.get('/', (req, res, next) => {
	Promise.resolve(listPsychologists(req, res)).catch(next);
});
router.get('/:id', (req, res, next) => {
	Promise.resolve(getPsychologist(req, res)).catch(next);
});

export default router;