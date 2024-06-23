import { AppError } from '../utils/errorHandler';
import { createPostInput, updatePostInput } from '../database/models/post.entity';
import { foundCommentsOutput } from '../database/models/comment.entity';
import * as commentRepo from '../database/daos/comment.repo';
import * as postRepo from '../database/daos/post.repo';
import fs from 'fs';

/* 게시글 목록 조회 */
const getAllPosts = async <foundPosts>(): Promise<foundPosts[]> => {
  try {
    const foundPosts: foundPosts[] = await postRepo.findPosts<foundPosts>();

    if (foundPosts.length === 0) throw new AppError(404, '존재하는 게시글이 없습니다.');

    return foundPosts;
  } catch (error) {
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
const getCategories = async <categories>(): Promise<categories[]> => {
  try {
    const foundCategories: categories[] = await postRepo.findCategories<categories>();

    if (foundCategories.length === 0) throw new AppError(404, '존재하는 카테고리가 없습니다.');

    return foundCategories;
  } catch (error) {
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
    const foundPosts: Posts[] = await postRepo.findPostsByKeyword<Posts>(user_location, keyword);

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
const getAllPostsByLocation = async <Posts>(
  user_location: string,
  post_category: string
): Promise<Posts[]> => {
  try {
    const foundPosts: Posts[] = await postRepo.findPostsByLocation<Posts>(
      user_location,
      post_category
    );

    if (foundPosts.length === 0) throw new AppError(404, '존재하는 게시글이 없습니다.');

    return foundPosts;
  } catch (error) {
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
const getPost = async <Post>(post_id: number): Promise<Post> => {
  try {
    const isValid: boolean = await postRepo.isPostIdValid(post_id);

    if (isValid === false) throw new AppError(404, '관리자에 의해 이미 삭제된 게시글 입니다.');

    const foundPost: Post = await postRepo.findPostById<Post>(post_id);

    const foundComments: foundCommentsOutput[] =
      await commentRepo.findCommentsByPost<foundCommentsOutput>(post_id);

    (foundPost as { comments: foundCommentsOutput[] }).comments =
      foundComments.length > 0 ? foundComments : []; // 댓글 없으면 빈 배열 할당됨

    return foundPost;
  } catch (error) {
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
const addPost = async <createdPost>(inputData: createPostInput): Promise<createdPost> => {
  try {
    const createdPostId: number = await postRepo.createPost(inputData);

    const foundCreatedPost: createdPost = await postRepo.findPostById<createdPost>(createdPostId);

    return foundCreatedPost;
  } catch (error) {
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
const editPost = async <updatedPost>(
  post_id: number,
  inputData: updatePostInput
): Promise<updatedPost> => {
  try {
    const isValid: boolean = await postRepo.isPostIdValid(post_id);

    if (isValid === false) throw new AppError(404, '관리자에 의해 이미 삭제된 게시글 입니다.');

    editImage(post_id, inputData);

    const updatedPostId: number = await postRepo.updatePost(post_id, inputData);

    const foundUpdatedPost: updatedPost = await postRepo.findPostById<updatedPost>(updatedPostId);

    return foundUpdatedPost;
  } catch (error) {
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
const removePost = async (post_id: number): Promise<number> => {
  try {
    const isValid: boolean = await postRepo.isPostIdValid(post_id);

    if (isValid === false) throw new AppError(404, '관리자에 의해 이미 삭제된 게시글 입니다.');

    removeImage(post_id);

    const deletedPostId = await postRepo.deletePost(post_id);

    return deletedPostId;
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

/* 게시글 이미지 로컬 수정 */
const editImage = async <Post>(post_id: number, inputData: updatePostInput) => {
  if (inputData.post_img === undefined) return; // 수정할 이미지가 없는 경우 로컬 삭제 안함

  const foundPost: Post = await postRepo.findPostById<Post>(post_id);

  const foundPostImage = (foundPost as { post_img: string }).post_img;

  if (foundPostImage === null) return; // 이미지가 원래 없는 게시글일 경우 로컬 삭제 안함

  // 이미지가 있는 게시글일 경우
  if (foundPostImage) {
    if (foundPostImage === inputData.post_img) return; // 수정할 이미지가 동일한 경우 로컬 삭제 안함
    else if (foundPostImage !== inputData.post_img) {
      // 수정할 이미지가 기존과 다른 경우 로컬 삭제
      const imgFileName = foundPostImage.split('/')[6];

      const filePath = `/Users/지원/Desktop/peepsProject/peeps_back-end/public/${imgFileName}`;
      // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
      // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

      fs.unlink(filePath, (error) => {
        if (error) throw new AppError(400, '게시글 이미지 수정 중 오류가 발생했습니다.');
      });
    }
  } else return; // 그 외의 경우 로컬 삭제 안함
};

/* 게시글 이미지 로컬 삭제 */
const removeImage = async <Post>(post_id: number) => {
  const foundPost: Post = await postRepo.findPostById<Post>(post_id);

  const foundPostImage = (foundPost as { post_img: string }).post_img;

  if (foundPostImage === null) return; // 이미지가 원래 없는 게시글일 경우 로컬 삭제 안함

  // 이미지가 있는 게시글일 경우
  if (foundPostImage) {
    const imgFileName = foundPostImage.split('/')[6];

    const filePath = `/Users/지원/Desktop/peepsProject/peeps_back-end/public/${imgFileName}`;
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
