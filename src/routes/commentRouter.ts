import { Router } from 'express';
import { addCommentHandler, removeCommentHandler } from '../controllers/commentController';

const router = Router();

/* 댓글 등록 */
router.post('/:user_id', addCommentHandler);

/* 댓글 삭제 */
router.delete('/:comment_id', removeCommentHandler);

export default router;
