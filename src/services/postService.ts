import { Post } from '../database/models/post.entity';
import { AppError } from '../utils/errorHandler';
import { createPostInput, updatePostInput } from '../database/models/post.entity';
import {
  findPosts,
  findCategories,
  findPostsByLocation,
  findPostById,
  createPost,
  updatePost,
  deletePost,
  isPostIdValid,
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
    const isValid = await isPostIdValid(post_id);

    if (isValid === false)
      throw new Error('[ 게시글 조회 에러 ] 관리자에 의해 이미 삭제된 게시글 입니다.');

    const foundPost = await findPostById(post_id);

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

    const foundCreatedPost = await findPostById(createdPostId);

    return foundCreatedPost;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(400, error.message || null);
    }
  }
};

/* post_id로 특정 게시글 수정 */
const editPost = async (post_id: number, inputData: updatePostInput) => {
  try {
    const isValid = await isPostIdValid(post_id);

    if (isValid === false)
      throw new Error('[ 게시글 수정 에러 ] 관리자에 의해 이미 삭제된 게시글 입니다.');

    const updatedPostId = await updatePost(post_id, inputData);

    const foundUpdatedPost = await findPostById(updatedPostId);

    return foundUpdatedPost;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(400, error.message);
    }
  }
};

/* 게시글 삭제 */
const removePost = async (post_id: number) => {
  try {
    const isValid = await isPostIdValid(post_id);

    if (isValid === false)
      throw new Error('[ 게시글 삭제 에러 ] 관리자에 의해 이미 삭제된 게시글 입니다.');

    const foundDeletedPostId = await deletePost(post_id);

    return foundDeletedPostId;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(400, error.message);
    }
  }
};

export {
  getAllPosts,
  getCategories,
  getAllPostsByLocation,
  getPost,
  addPost,
  editPost,
  removePost,
};
