import { Router } from 'express';
import { addCommentHandler } from '../controllers/commentController';

const router = Router();

router.post('/:user_id', addCommentHandler);

export default router;
