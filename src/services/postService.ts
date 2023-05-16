import { Post } from '../database/models/post.entity';
import { AppError } from '../utils/errorHandler';
import { createPostInput, updatePostInput } from '../database/models/post.entity';
import {
  findPosts,
  findCategories,
  findPostsByLocation,
  findPostById,
  createPost,
} from '../database/daos/post.repo';

/* 게시글 목록 조회 */
const getAllPosts = async (): Promise<Post[]> => {
  try {
    const foundPosts = await findPosts();

    if (foundPosts.length === 0)
      throw new Error('[ 게시글 목록 조회 에러 ] 존재하는 게시글이 없습니다.');

    return foundPosts;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(404, error.message);
    }
  }
};

/* 게시글 카테고리 조회 */
const getCategories = async (): Promise<string[]> => {
  try {
    const foundCategories = await findCategories();

    if (foundCategories.length === 0)
      throw new Error('[ 카테고리 조회 에러 ] 존재하는 카테고리가 없습니다.');

    return foundCategories;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(404, error.message);
    }
  }
};

/* 카테고리별 게시글 목록 조회 */
const getAllPostsByLocation = async (
  user_location: string,
  post_category: string
): Promise<Post[]> => {
  try {
    const foundPosts = await findPostsByLocation(user_location, post_category);

    if (foundPosts.length === 0)
      throw new Error('[ 카테고리별 게시글 목록 조회 에러 ] 존재하는 게시글이 없습니다.');

    return foundPosts;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(404, error.message);
    }
  }
};

/* post_id로 게시글 조회 */
const getPost = async (post_id: number): Promise<Post> => {
  try {
    const foundPost = await findPostById(post_id);

    if (foundPost === undefined)
      throw new Error('[ 게시글 조회 에러 ] 게시글이 존재하지 않습니다.');

    return foundPost;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else throw new AppError(404, error.message);
  }
};

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
      throw new AppError(400, error.message || null);
    }
  }
};

export { getAllPosts, getCategories, getAllPostsByLocation, getPost, addPost };
