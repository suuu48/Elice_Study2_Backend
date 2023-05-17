import { db } from '../../config/dbconfig';
import { Comment } from '../models/comment.entity';
import { AppError } from '../../utils/errorHandler';
import { createCommentInput, updateCommentInput } from '../models/comment.entity';

/* 댓글 조회 */
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
    throw new AppError(500, '[ 쿼리 실행 에러 ] 댓글 조회 실패');
  }
};

/* 게시글별 댓글 목록 조회 */
const findCommentsByPost = async (post_id: number): Promise<Comment[]> => {
  try {
    const selectColums =
      'comment.comment_id, user.user_img, user.user_nickname, comment.comment_content, comment.created_at';

    const SQL = `
    SELECT ${selectColums}
    FROM comment
    JOIN user ON user.user_id = comment.user_id
    WHERE comment.post_id = ?
    `;

    const [commentRows]: any = await db.query(SQL, [post_id]);

    return commentRows;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ 쿼리 실행 에러 ] 게시글별 댓글 목록 조회 실패');
  }
};

/* 댓글 등록 */
const createComment = async (inputData: createCommentInput): Promise<number> => {
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

    return createdCommentId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ 쿼리 실행 에러 ] 댓글 등록 실패');
  }
};

/* 댓글 수정 */
const updateComment = async (
  comment_id: number,
  inputData: updateCommentInput
): Promise<number> => {
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

    // const updatedComment = await findCommentById(comment_id);
    // return updatedComment!;
    return comment_id;
  } catch (error) {
    console.log(error);
    throw new Error('[ 댓글 수정 실패 ]: 쿼리 실행 중 에러가 발생했습니다.'); // App Error
  }
};

/* 댓글 삭제 */
const deleteComment = async (comment_id: number): Promise<number> => {
  try {
    const SQL = `
    DELETE FROM comment
    WHERE comment_id = ?`;

    await db.query(SQL, [comment_id]);

    return comment_id;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ 쿼리 실행 에러 ] 댓글 삭제 실패'); // App Error
  }
};

/* comment_id 유효성 검사 */
const isCommentIdValid = async (comment_id: number): Promise<boolean> => {
  const SQL = `
    SELECT COUNT(*) AS count
    FROM comment
    WHERE comment_id = ?
  `;

  const [countRows]: any = await db.query(SQL, [comment_id]);

  const count = countRows[0].count;

  return count > 0;
};

export {
  findCommentById,
  findCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  isCommentIdValid,
};
