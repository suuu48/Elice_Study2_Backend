import { db } from '../../config/dbconfig';
import { Post } from '../models/post.entity';
import { AppError } from '../../utils/errorHandler';
import { createPostInput, updatePostInput } from '../models/post.entity';

/* 게시글 목록 조회 */
const findPosts = async (): Promise<Post[]> => {
  try {
    const SQL = `
    SELECT * 
    FROM post
    `;

    const [postRows]: any = await db.query(SQL);

    return postRows;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 게시글 목록 조회 실패');
  }
};

/* 게시글 카테고리 조회 */
const findCategories = async (): Promise<string[]> => {
  try {
    const SQL = `
    SELECT post_category
    FROM post
    GROUP BY post_category
    `;

    const [categoryRows]: any = await db.query(SQL);

    return categoryRows;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 카테고리 조회 실패');
  }
};

/* 키워드별 게시글 목록 조회 */
const findPostsByKeyword = async <Posts>(
  user_location: string,
  keyword: string
): Promise<Posts[]> => {
  try {
    const selectColums =
      'post.post_id, post.user_id, user.user_nickname, post.post_title, post.post_img, COUNT(comment.post_id) AS comment_count, post.created_at';

    const SQL = `
      SELECT ${selectColums}
      FROM post
      JOIN user ON user.user_id = post.user_id
      LEFT JOIN comment ON comment.post_id = post.post_id
      WHERE user.user_location = ? AND (post.post_title LIKE '%${keyword}%' OR post.post_content LIKE '%${keyword}%')
      GROUP BY post.post_id
      `;

    const [postRows]: any = await db.query(SQL, [user_location]);

    return postRows;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 키워드별 게시글 목록 조회 실패');
  }
};

/* 카테고리별 게시글 목록 조회 */
const findPostsByLocation = async (
  user_location: string,
  post_category: string
): Promise<Post[]> => {
  try {
    const selectColums =
      'post.post_id, post.user_id, user.user_nickname, post.post_title, post.post_img, COUNT(comment.post_id) AS comment_count, post.created_at';

    const SQL = `
    SELECT ${selectColums}
      FROM post
      JOIN user ON user.user_id = post.user_id
      LEFT JOIN comment ON comment.post_id = post.post_id
      WHERE user.user_location = ? AND post.post_category = ?
      GROUP BY post.post_id
    `;

    const [postRows]: any = await db.query(SQL, [user_location, post_category]);

    return postRows;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 카테고리별 게시글 목록 조회 실패');
  }
};

/* 게시글 조회 */
const findPostById = async (post_id: number): Promise<Post> => {
  try {
    const selectColums =
      'post.post_id, user.user_img, user.user_nickname, post.post_category, post.post_title, post.post_content, post.post_img, COUNT(comment.post_id) AS comment_count, post.created_at';

    const SQL = `
    SELECT ${selectColums}
    FROM post 
    JOIN user ON user.user_id = post.user_id
    LEFT JOIN comment ON comment.post_id = post.post_id
    WHERE post.post_id = ?
    `;

    const [post]: any = await db.query(SQL, [post_id]);

    return post[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 게시글 조회 실패');
  }
};

/* 게시글 등록 */
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

    const [result, _] = await db.query(SQL);

    const createdPostId = (result as { insertId: number }).insertId;

    return createdPostId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 게시글 등록 실패');
  }
};

/* 게시글 수정 */
const updatePost = async (post_id: number, inputData: updatePostInput): Promise<number> => {
  try {
    const updateColums = Object.entries(inputData)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}='${value}'`)
      .join(', ');

    const SQL = `
      UPDATE post
      SET ${updateColums}
      WHERE post_id = ?
    `;

    const [result, _] = await db.query(SQL, [post_id]);

    // const changedCount = (result as { info: string }).info.split(' ');

    // if (Number(changedCount[5]) === 0)
    //   throw new AppError(500, '수정하신 내용이 기존과 동일합니다.'); // Fix : 서비스에서 처리

    return post_id;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 게시글 수정 실패');
  }
};

/* 게시글 삭제 */
const deletePost = async (post_id: number): Promise<number> => {
  try {
    const SQL = `
    DELETE FROM post
    WHERE post_id = ?
    `;

    await db.query(SQL, [post_id]);

    return post_id;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 게시글 삭제 실패');
  }
};

/* post_id 유효성 검사 */
const isPostIdValid = async (post_id: number): Promise<boolean> => {
  const SQL = `
    SELECT COUNT(*) AS count
    FROM post
    WHERE post_id = ?
  `;

  const [countRows]: any = await db.query(SQL, [post_id]);

  const count = countRows[0].count;

  return count > 0;
};

export {
  findPosts,
  findCategories,
  findPostsByKeyword,
  findPostsByLocation,
  findPostById,
  createPost,
  updatePost,
  deletePost,
  isPostIdValid,
};
