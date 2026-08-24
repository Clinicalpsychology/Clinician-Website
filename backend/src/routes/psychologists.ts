import { Router } from 'express';
import { listPsychologists } from '../controllers/psychologists';

const router = Router();

router.get('/', listPsychologists);

export default router;