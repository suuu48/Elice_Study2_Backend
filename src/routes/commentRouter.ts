import { Router } from 'express';
import * as commentController from '../controllers/commentController';

const commentRouter = Router();

/* 댓글 등록 */
commentRouter.post('/:user_id', commentController.addCommentHandler);

/* 댓글 삭제 */
commentRouter.delete('/:comment_id', commentController.removeCommentHandler);

export default commentRouter;
