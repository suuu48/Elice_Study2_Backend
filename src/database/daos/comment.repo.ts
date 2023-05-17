import { db } from '../../config/dbconfig';
import { Comment } from '../models/comment.entity';
import { AppError } from '../../utils/errorHandler';
import { createCommentInput, updateCommentInput } from '../models/comment.entity';

/* 전체 댓글 조회 */
const findComments = async (): Promise<Comment[]> => {
  try {
    const SQL = `
    SELECT * 
    FROM comment
    `;

    const [commentRows]: any = await db.query(SQL);

    return commentRows;
  } catch (error) {
    console.log(error);
    throw new Error('[게시글 전체 조회 실패 ]: 쿼리 실행 중 에러가 발생했습니다.'); // App Error
  }
};

/* comment_id로 특정 댓글 조회 */
const findCommentById = async (comment_id: number): Promise<Comment> => {
  try {
    const SQL = `
        SELECT * 
        FROM comment 
        WHERE comment_id = ?
        `;

    const [comment]: any = await db.query(SQL, [comment_id]);

    return comment[0];
  } catch (error) {
    console.log(error);
    throw new Error('[ 댓글 조회 실패 ]: 쿼리 실행 중 에러가 발생했습니다.'); // App Error
  }
};

/* 댓글 생성 */
const createComment = async (inputData: createCommentInput): Promise<Comment> => {
  try {
    const createColums = 'post_id, user_id, comment_content';
    const createValues = Object.values(inputData)
      .map((value) => `'${value}'`)
      .join(', ');

    const SQL = `
    INSERT INTO
    comment (${createColums}) 
    VALUES (${createValues})
    `;

    const [result, _] = await db.query(SQL);

    const createdCommentId = (result as { insertId: number }).insertId;
    const createdComment = await findCommentById(createdCommentId);

    return createdComment!;
  } catch (error) {
    console.log(error);
    throw new Error('[ 댓글 생성 실패 ]: 쿼리 실행 중 에러가 발생했습니다.'); // App Error
  }
};

/* comment_id로 특정 댓글 수정 */
const updateComment = async (
  comment_id: number,
  inputData: updateCommentInput
): Promise<Comment> => {
  try {
    const updateColums = Object.entries(inputData)
      .map(([key, value]) => `${key}='${value}'`)
      .join(', ');

    const SQL = `
      UPDATE comment
      SET ${updateColums}
      WHERE comment_id = ?
    `;

    await db.query(SQL, [comment_id]);

    const updatedComment = await findCommentById(comment_id);
    return updatedComment!;
  } catch (error) {
    console.log(error);
    throw new Error('[ 댓글 수정 실패 ]: 쿼리 실행 중 에러가 발생했습니다.'); // App Error
  }
};

/* 게시글 삭제 */
const deleteComment = async (comment_id: number): Promise<Comment> => {
  try {
    const SQL = `
    UPDATE comment
    SET delete_flag = 1
    WHERE comment_id = ?`;

    await db.query(SQL, [comment_id]);

    const softDeletedComment = await findCommentById(comment_id);
    return softDeletedComment!;
  } catch (error) {
    console.log(error);
    throw new Error('[ 댓글 삭제 실패 ]: 쿼리 실행 중 에러가 발생했습니다.'); // App Error
  }
};

export { findComments, findCommentById, createComment, updateComment, deleteComment };
