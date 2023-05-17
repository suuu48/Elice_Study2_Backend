import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { createCommentInput, updateCommentInput } from '../database/models/comment.entity';
import { addComment, removeComment } from '../services/commentService';

/* 댓글 등록 */
const addCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { post_id, comment_content } = req.body;

    if (!post_id || !user_id || !comment_content)
      throw new Error('[ 요청 에러 ] 모든 필드를 입력해야 합니다.');

    const commentData: createCommentInput = {
      post_id: parseInt(post_id),
      user_id,
      comment_content,
    };

    const createdComment = await addComment(commentData);

    res.status(201).json({ message: '댓글 등록 성공', data: createdComment });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else {
      console.log(error);
      next(new AppError(500, error.message));
    }
  }
};

/* 댓글 삭제 */
const removeCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { comment_id } = req.params;

    if (!comment_id) throw new Error('[ 요청 에러 ] comment_id가 필요합니다.');

    const deletedComment = await removeComment(parseInt(comment_id));

    res.status(200).json({ message: '댓글 삭제 성공', data: { comment_id: deletedComment } });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else {
      console.log(error);
      next(new AppError(500, error.message));
    }
  }
};

export { addCommentHandler, removeCommentHandler };
