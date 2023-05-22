import { Post } from '../database/models/post.entity';
import { AppError } from '../utils/errorHandler';
import { createPostInput, updatePostInput } from '../database/models/post.entity';
import * as commentRepo from '../database/daos/comment.repo';
import * as postRepo from '../database/daos/post.repo';
import fs from 'fs';

/* 게시글 목록 조회 */
const getAllPosts = async (): Promise<Post[]> => {
  try {
    const foundPosts = await postRepo.findPosts();

    if (foundPosts.length === 0) throw new AppError(404, '존재하는 게시글이 없습니다.');

    return foundPosts;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 게시글 목록 조회 실패');
    }
  }
};

/* 게시글 카테고리 조회 */
const getCategories = async (): Promise<string[]> => {
  try {
    const foundCategories = await postRepo.findCategories();

    if (foundCategories.length === 0) throw new AppError(404, '존재하는 카테고리가 없습니다.');

    return foundCategories;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 카테고리 조회 실패');
    }
  }
};

/* 키워드별 게시글 목록 조회 */
const getSearchedPostsByKeyword = async <Posts>(
  user_location: string,
  keyword: string
): Promise<Posts[]> => {
  try {
    const foundPosts = await postRepo.findPostsByKeyword<Posts>(user_location, keyword);

    if (foundPosts.length === 0) throw new AppError(404, '존재하는 게시글이 없습니다.');

    return foundPosts;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 키워드별 게시글 목록 조회 실패');
    }
  }
};

/* 카테고리별 게시글 목록 조회 */
const getAllPostsByLocation = async (
  user_location: string,
  post_category: string
): Promise<Post[]> => {
  try {
    const foundPosts = await postRepo.findPostsByLocation(user_location, post_category);

    if (foundPosts.length === 0) throw new AppError(404, '존재하는 게시글이 없습니다.');

    return foundPosts;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 카테고리별 게시글 목록 조회 실패');
    }
  }
};

/* 게시글 및 게시글별 댓글 목록 조회 */
const getPost = async (post_id: number): Promise<Post> => {
  try {
    const isValid = await postRepo.isPostIdValid(post_id);

    if (isValid === false) throw new AppError(404, '관리자에 의해 이미 삭제된 게시글 입니다.');

    const foundPost = await postRepo.findPostById(post_id);

    const foundComments = await commentRepo.findCommentsByPost(post_id);

    foundPost.comments = foundComments; // 댓글 없으면 빈 배열 할당됨

    return foundPost;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 게시글 조회 실패');
    }
  }
};

/* 게시글 등록 */
const addPost = async (inputData: createPostInput) => {
  try {
    const createdPostId = await postRepo.createPost(inputData);

    const foundCreatedPost = await postRepo.findPostById(createdPostId);

    return foundCreatedPost;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 게시글 등록 실패');
    }
  }
};

/* 게시글 수정 */
const editPost = async (post_id: number, inputData: updatePostInput) => {
  try {
    const isValid = await postRepo.isPostIdValid(post_id);

    if (isValid === false) throw new AppError(404, '관리자에 의해 이미 삭제된 게시글 입니다.');

    editImage(post_id, inputData);

    const updatedPostId = await postRepo.updatePost(post_id, inputData);

    const foundUpdatedPost = await postRepo.findPostById(updatedPostId);

    return foundUpdatedPost;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 게시글 수정 실패');
    }
  }
};

/* 게시글 삭제 */
const removePost = async (post_id: number) => {
  try {
    const isValid = await postRepo.isPostIdValid(post_id);

    if (isValid === false) throw new AppError(404, '관리자에 의해 이미 삭제된 게시글 입니다.');

    removeImage(post_id);

    const deletedPostId = await postRepo.deletePost(post_id);

    return deletedPostId;
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

/* 게시글 이미지 로컬 수정 */
const editImage = async (post_id: number, inputData: updatePostInput) => {
  const foundPost = await postRepo.findPostById(post_id);

  if (foundPost.post_img && foundPost.post_img !== inputData.post_img) {
    const imgFileName = foundPost.post_img.split('/')[6];

    const filePath = `/Users/지원/Desktop/peeps_back-end/public/${imgFileName}`;
    // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
    // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

    fs.unlink(filePath, (error) => {
      if (error) throw new AppError(400, '게시글 이미지 수정 중 오류가 발생했습니다.');
    });
  } else return;
};

/* 게시글 이미지 로컬 삭제 */
const removeImage = async (post_id: number) => {
  const foundPost = await postRepo.findPostById(post_id);

  if (foundPost.post_img) {
    const imgFileName = foundPost.post_img.split('/')[6];

    const filePath = `/Users/지원/Desktop/peeps_back-end/public/${imgFileName}`;
    // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
    // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

    fs.unlink(filePath, (error) => {
      if (error) throw new AppError(400, '게시글 이미지 삭제 중 오류가 발생했습니다.');
    });
  } else return;
};

export {
  getAllPosts,
  getCategories,
  getSearchedPostsByKeyword,
  getAllPostsByLocation,
  getPost,
  addPost,
  editPost,
  removePost,
};
