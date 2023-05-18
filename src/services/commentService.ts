import { AppError } from '../utils/errorHandler';
import { createCommentInput, updateCommentInput } from '../database/models/comment.entity';
import {
  findCommentById,
  createComment,
  deleteComment,
  isCommentIdValid,
} from '../database/daos/comment.repo';

/* 댓글 등록 */
const addComment = async (inputData: createCommentInput) => {
  try {
    const createdCommentId = await createComment(inputData);

    const foundCreatedComment = await findCommentById(createdCommentId);

    return foundCreatedComment;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 댓글 등록 실패');
    }
  }
};

/* 댓글 삭제 */
const removeComment = async (comment_id: number) => {
  try {
    const isValid = await isCommentIdValid(comment_id);

    if (isValid === false) throw new AppError(404, '관리자에 의해 이미 삭제된 댓글 입니다.');

    const foundDeletedCommentId = await deleteComment(comment_id);

    return foundDeletedCommentId;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 게시글 삭제 실패');
    }
  }
};

export { addComment, removeComment };
