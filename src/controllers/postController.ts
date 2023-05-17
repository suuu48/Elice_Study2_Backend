import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { createPostInput, updatePostInput } from '../database/models/post.entity';
import {
  getAllPosts,
  getCategories,
  getSearchedPostsByKeyword,
  getAllPostsByLocation,
  getPost,
  addPost,
  editPost,
  removePost,
} from '../services/postService';

/* 게시글 목록 조회 */
const getAllPostsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundPosts = await getAllPosts();

    res.status(200).json({ message: '게시글 목록 조회 성공', data: foundPosts });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message || null));
  }
};

/* 게시글 카테고리 조회 */
const getCategoriesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundCategories = await getCategories();

    const foundCategoryList = foundCategories.map((category: any) => category.post_category);

    res.status(200).json({ message: '카테고리 조회 성공', data: foundCategoryList });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message || null));
  }
};

/* 검색 키워드별 게시글 목록 조회 */
const getSearchedPostsByKeywordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const keyword = req.query.keyword as string;
    const { user_location } = req.body; // Fix : 나중에 jwt로 받기

    if (!keyword) throw new Error('[ 요청 에러 ] keyword가 필요합니다.');

    const foundPosts = await getSearchedPostsByKeyword(user_location, keyword);

    res.status(200).json({ message: '검색 키워드별 게시글 목록 조회 성공', data: foundPosts });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message));
  }
};

/* 카테고리별 게시글 목록 조회 */
const getAllPostsByLocationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_category } = req.params;
    const { user_location } = req.body; // Fix : 나중에 jwt로 받기

    if (!post_category) throw new Error('[ 요청 에러 ] post_category가 필요합니다.');

    const foundPosts = await getAllPostsByLocation(user_location, post_category);

    res.status(200).json({ message: '카테고리별 게시글 목록 조회 성공', data: foundPosts });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message));
  }
};

/* 게시글 및 게시글별 댓글 목록 조회 */
const getPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;
    if (!parseInt(post_id)) throw new Error('[ 요청 에러 ] post_id가 필요합니다.');

    const foundpost = await getPost(parseInt(post_id));

    res.status(200).json({ message: '게시글 조회 성공', data: foundpost });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message));
  }
};

/* 게시글 등록 */
const addPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { post_category, post_title, post_content, post_img } = req.body;

    if (!user_id || !post_category || !post_title || !post_content || !post_img)
      throw new Error('[ 요청 에러 ] 모든 필드를 입력해야 합니다.');

    const postData: createPostInput = {
      user_id,
      post_category,
      post_title,
      post_content,
      post_img,
    };

    const createdPost = await addPost(postData);
    res.status(201).json({ message: '게시글 등록 성공', data: createdPost });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else {
      console.log(error);
      next(new AppError(500, error.message));
    }
  }
};

/* 게시글 수정 */
const editPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;
    const { post_category, post_title, post_content, post_img } = req.body;

    if (!post_id || !post_category || !post_title || !post_content || !post_img)
      throw new Error('[ 요청 에러 ] 모든 필드를 입력해야 합니다.');

    const postData: updatePostInput = {
      post_category,
      post_title,
      post_content,
      post_img,
    };

    const updatedPost = await editPost(parseInt(post_id), postData);

    res.status(201).json({ message: '게시글 수정 성공', data: updatedPost });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else {
      console.log(error);
      next(new AppError(500, error.message));
    }
  }
};

/* 게시글 삭제 */
const removePostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;

    if (!post_id) throw new Error('[ 요청 에러 ] post_id가 필요합니다.');

    const deletedPost = await removePost(parseInt(post_id));

    res.status(201).json({ message: '게시글 삭제 성공', data: { post_id: deletedPost } });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else {
      console.log(error);
      next(new AppError(500, error.message));
    }
  }
};

export {
  getAllPostsHandler,
  getCategoriesHandler,
  getSearchedPostsByKeywordHandler,
  getAllPostsByLocationHandler,
  getPostHandler,
  addPostHandler,
  editPostHandler,
  removePostHandler,
};
