import { Post } from '../database/models/post.entity';
import { AppError } from '../utils/errorHandler';
import { createPostInput, updatePostInput } from '../database/models/post.entity';
import { createPost, findPosts, findPostById } from '../database/daos/post.repo';

/* 게시글 생성 */
const addPost = async (inputData: createPostInput) => {
  try {
    const createdPostId = await createPost(inputData);

    const foundPost = await findPostById(createdPostId);
    // if (!foundPost) throw new Error('[ 게시글 등록 에러 ] 등록된 게시글이 없습니다.');

    return foundPost;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(500, error.message || null);
    }
  }
};

/* 전체 게시글 조회 */
const getAllPosts = async (): Promise<Post[]> => {
  try {
    const foundPosts = await findPosts();

    if (foundPosts === undefined)
      throw new Error('[ 전체 게시글 조회 에러 ] 존재하는 게시글이 없습니다.');

    return foundPosts;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(500, error.message);
    }
  }
};

/* post_id로 특정 게시글 조회 */
const getPost = async (post_id: number): Promise<Post> => {
  try {
    const post = await findPostById(post_id);

    if (post === undefined) throw new Error('[ 게시글 조회 에러 ] 게시글이 존재하지 않습니다.');

    return post;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else throw new AppError(404, error.message);
  }
};

export { addPost, getAllPosts, getPost };
