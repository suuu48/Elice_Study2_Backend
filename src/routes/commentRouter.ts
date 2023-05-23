import { Router } from 'express';
import { isAccessTokenValid } from '../middlewares';
import { createCommentOutput } from '../database/models/comment.entity';
import { addCommentHandler, removeCommentHandler } from '../controllers/commentController';

const commentRouter = Router();

/* 댓글 등록 */
commentRouter.post('/:user_id', isAccessTokenValid, addCommentHandler<createCommentOutput>);

/* 댓글 삭제 */
commentRouter.delete('/:comment_id', isAccessTokenValid, removeCommentHandler);

export default commentRouter;
