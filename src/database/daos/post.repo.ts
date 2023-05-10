import { db } from '../../config/dbconfig';
import { Post } from '../models/post.entity';

/* 게시글 생성 */
const createPost = async (inputData: Record<string, string | number>): Promise<Post> => {
  try {
    // console.log('inputData: ', inputData);
    const createColums = 'user_id, post_category, post_title, post_content';

    const createValues = Object.values(inputData)
      .map((value) => `'${value}'`)
      .join(', ');

    // console.log('createValues: ', createValues);
    const SQL = `
    INSERT INTO
    post (${createColums}) 
    VALUES (${createValues})
    `;

    const [result, _] = await db.query(SQL); // 두번째 인수는 undefined라서 _ 로 받음

    if ((result as { affectedRows: number }).affectedRows === 0)
      return Promise.reject('게시글 생성 오류'); // 생성된게 없으면 App Error

    const createdPostId = (result as { insertId: number }).insertId;
    const createdPost = await findPostById(createdPostId);

    return createdPost!; // null일 가능성이 없음을 !로 명시적 선언함
  } catch (error) {
    console.log(error);
    return Promise.reject('[게시글 생성] 서버 에러'); // App Error
  }
};

/* 전체 게시글 조회 */
const findAllPost = async (): Promise<Post[]> => {
  try {
    const SQL = `
    SELECT * 
    FROM post
    `;

    const [row]: any = await db.query(SQL);
    if (!Array.isArray(row) || row.length === 0)
      // 배열이 먼저 비어있는지 확인
      return Promise.reject('게시글 목록이 존재하지 않습니다.'); // 조회한 전체 게시글이 없으면 App Error

    return row; //as Post;
  } catch (error) {
    console.log(error);
    return Promise.reject('[게시글 전체 조회] 서버 에러'); // App Error
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

    const [row]: any = await db.query(SQL, [post_id]);
    if (!Array.isArray(row) || row.length === 0)
      // 배열이 먼저 비어있는지 확인
      return Promise.reject('게시글이 존재하지 않습니다.'); // 조회한 특정 게시글이 없으면 App Error

    return row[0]; //as Post;
  } catch (error) {
    console.log(error);
    return Promise.reject('[게시글 단일 조회] 서버 에러'); // App Error
  }
};

/* post_id로 특정 게시글 수정 */
const updatePost = async (
  post_id: number,
  inputData: Record<string, string | number>
): Promise<Post> => {
  try {
    // 'post_category=?, post_title=?, post_content=?, post_img=?' 이거만 받아야 함
    const updateColums = Object.entries(inputData) // inputData 객체를 [[key, value],...] 2차원 배열로 만들기
      .map(([key, value]) => `${key}='${value}'`)
      .join(', ');

    const SQL = `
      UPDATE post
      SET ${updateColums}
      WHERE post_id = ?
    `;

    const [result, _] = await db.query(SQL, [post_id]);

    // console.log((result as { info: string }).info);
    const info = (result as { info: string }).info.split(' ');

    if ((result as { affectedRows: number }).affectedRows === 0)
      return Promise.reject('게시글 수정 오류'); // 수정 오류 없으면 App Error

    if (Number(info[5]) === 0) return Promise.reject('수정하실 내용이 기존과 동일합니다.'); // 수정 변동사항 없으면 App Error

    const updatedPost = await findPostById(post_id);
    return updatedPost!;
  } catch (error) {
    console.log(error);
    return Promise.reject('[게시글 수정] 서버 에러'); // App Error
  }
};

/* 게시글 삭제 */
const softDeletePost = async (post_id: number): Promise<Post> => {
  try {
    const SQL = `
    UPDATE post
    SET delete_flag = 1
    WHERE post_id = ?`;

    const [result, _] = await db.query(SQL, [post_id]);

    const info = (result as { info: string }).info.split(' ');

    if ((result as { affectedRows: number }).affectedRows === 0)
      return Promise.reject('게시글 삭제 오류'); // 삭제된게 없으면 App Error

    if (Number(info[5]) === 0) return Promise.reject('이미 삭제된 게시글입니다.'); // 이미 삭제된거면 App Error

    const softDeletedPost = await findPostById(post_id);
    return softDeletedPost!;
  } catch (error) {
    console.log(error);
    return Promise.reject('[게시글 삭제] 서버 에러'); // App Error
  }
};

export { createPost, findAllPost, findPostById, updatePost, softDeletePost };
