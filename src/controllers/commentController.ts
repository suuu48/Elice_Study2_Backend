import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { createCommentInput, updateCommentInput } from '../database/models/comment.entity';
import * as commentService from '../services/commentService';

/* 댓글 등록 */
const addCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { post_id, comment_content } = req.body;

    if (!user_id) throw new AppError(400, 'user_id를 입력해주세요.');

    if (!post_id || !comment_content)
      throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');

    if (isNaN(Number(post_id))) throw new AppError(400, '유효한 post_id를 입력해주세요.');

    const commentData: createCommentInput = {
      post_id: parseInt(post_id),
      user_id,
      comment_content,
    };

    const createdComment = await commentService.addComment(commentData);

    res.status(201).json({ message: '댓글 등록 성공', data: createdComment });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 댓글 등록 실패'));
    }
  }
};

/* 댓글 삭제 */
const removeCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment_id } = req.params;

    if (isNaN(Number(comment_id))) throw new AppError(400, '유효한 comment_id를 입력해주세요.');

    const deletedComment = await commentService.removeComment(parseInt(comment_id));

    res.status(200).json({ message: '댓글 삭제 성공', data: { comment_id: deletedComment } });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 댓글 삭제 실패'));
    }
  }
};

export { addCommentHandler, removeCommentHandler };
