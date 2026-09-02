import { Router } from 'express';
import { listPsychologists } from '../controllers/psychologists';

const router = Router();

router.get('/', (req, res, next) => {
	Promise.resolve(listPsychologists(req, res)).catch(next);
});

export default router;