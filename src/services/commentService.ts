import { AppError } from '../utils/errorHandler';
import { createCommentInput, updateCommentInput } from '../database/models/comment.entity';
import { findCommentById, createComment, deleteComment } from '../database/daos/comment.repo';

/* 댓글 등록 */
const addComment = async (inputData: createCommentInput) => {
  try {
    const createdCommentId = await createComment(inputData);

    const foundCreatedComment = await findCommentById(createdCommentId);

    return foundCreatedComment;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(400, error.message || null);
    }
  }
};

/* 댓글 삭제 */
const removeComment = async (comment_id: number) => {
  try {
    const foundDeletedCommentId = await deleteComment(comment_id);

    return foundDeletedCommentId;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(404, error.message);
    }
  }
};

export { addComment, removeComment };
