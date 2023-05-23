import { AppError } from '../utils/errorHandler';
import { createCommentInput } from '../database/models/comment.entity';
import * as commentRepo from '../database/daos/comment.repo';

/* 댓글 등록 */
const addComment = async <createCommentOutput>(
  inputData: createCommentInput
): Promise<createCommentOutput> => {
  try {
    const createdCommentId = await commentRepo.createComment(inputData);

    const foundCreatedComment = await commentRepo.findCommentById<createCommentOutput>(
      createdCommentId
    );

    return foundCreatedComment;
  } catch (error) {
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
    const isValid = await commentRepo.isCommentIdValid(comment_id);

    if (isValid === false) throw new AppError(404, '관리자에 의해 이미 삭제된 댓글 입니다.');

    const foundDeletedCommentId = await commentRepo.deleteComment(comment_id);

    return foundDeletedCommentId;
  } catch (error) {
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
