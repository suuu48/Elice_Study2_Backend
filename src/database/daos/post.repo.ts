import { db } from '../../config/dbconfig';
import { Post } from '../models/post.entity';
import { AppError } from '../../utils/errorHandler';
import { createPostInput, updatePostInput } from '../models/post.entity';

/* 게시글 생성 */
const createPost = async (inputData: createPostInput): Promise<number> => {
  try {
    const createColums = 'user_id, post_category, post_title, post_content, post_img';
    const createValues = Object.values(inputData)
      .map((value) => `'${value}'`)
      .join(', ');

    const SQL = `
    INSERT INTO
    post (${createColums}) 
    VALUES (${createValues})
    `;

    const [result, _] = await db.query(SQL); // 두번째 인수는 undefined라서 _ 로 받음

    const createdPostId = (result as { insertId: number }).insertId;
    return createdPostId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ 쿼리 실행 에러 ] 게시글 등록 실패');
  }
};

/* 전체 게시글 조회 */
const findPosts = async (): Promise<Post[]> => {
  try {
    const SQL = `
    SELECT * 
    FROM post
    `;

    const [postRows]: any = await db.query(SQL);
    if (!Array.isArray(postRows) || postRows.length === 0)
      throw new Error('[ 전체 게시글 조회 오류 ]: 게시글 목록이 존재하지 않습니다.'); // App Error >> 서비스로 옮길 에정

    return postRows;
  } catch (error) {
    console.log(error);
    throw new Error('[ 쿼리 실행 에러 ]: 게시글 전체 조회 실패.');
  }
};

/* post_id로 특정 게시글 조회 */
const findPostById = async (post_id: number): Promise<Post> => {
  try {
    const SQL = `
    SELECT * 
    FROM post 
    WHERE post_id = ?
    `;

    const [post]: any = await db.query(SQL, [post_id]);

    return post[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ 쿼리 실행 에러 ] 게시글 조회 실패');
  }
};

/* post_id로 특정 게시글 수정 */
const updatePost = async (post_id: number, inputData: updatePostInput): Promise<Post> => {
  try {
    const updateColums = Object.entries(inputData)
      .map(([key, value]) => `${key}='${value}'`)
      .join(', ');

    const SQL = `
      UPDATE post
      SET ${updateColums}
      WHERE post_id = ?
    `;

    const [result, _] = await db.query(SQL, [post_id]);

    const info = (result as { info: string }).info.split(' ');
    if ((result as { affectedRows: number }).affectedRows === 0)
      throw new Error('[ 게시글 수정 오류 ]: 수정된 게시글이 없습니다. '); // App Error >> 서비스로 옮길 에정

    if (Number(info[5]) === 0)
      throw new Error('[ 게시글 수정 오류 ]: 수정하신 내용이 기존과 동일합니다.'); // App Error >> 서비스로 옮길 에정

    const updatedPost = await findPostById(post_id);
    return updatedPost!;
  } catch (error) {
    console.log(error);
    throw new Error('[ 쿼리 실행 에러 ]: 게시글 수정 실패'); // App Error
  }
};

/* 게시글 삭제 */
const softDeletePost = async (post_id: number): Promise<Post> => {
  try {
    const SQL = `
    UPDATE post
    SET delete_flag = 1
    WHERE post_id = ?
    `;

    const [result, _] = await db.query(SQL, [post_id]);

    const info = (result as { info: string }).info.split(' ');

    if ((result as { affectedRows: number }).affectedRows === 0)
      throw new Error('[ 게시글 삭제 오류 ]: 삭제된 게시글이 없습니다.'); // App Error >> 서비스로 옮길 에정

    if (Number(info[5]) === 0) throw new Error('[ 게시글 삭제 오류 ]: 이미 삭제된 게시글입니다.'); // App Error >> 서비스로 옮길 에정

    const softDeletedPost = await findPostById(post_id);
    return softDeletedPost!;
  } catch (error) {
    console.log(error);
    throw new Error('[ 쿼리 실행 에러 ]: 게시글 삭제 실패'); // App Error
  }
};

export { createPost, findPosts, findPostById, updatePost, softDeletePost };
