import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { createPostInput, updatePostInput } from '../database/models/post.entity';
import * as postService from '../services/postService';

/* 게시글 목록 조회 */
const getAllPostsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundPosts = await postService.getAllPosts();

    res.status(200).json({ message: '게시글 목록 조회 성공', data: foundPosts });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 게시글 목록 조회 실패'));
    }
  }
};

/* 게시글 카테고리 조회 */
const getCategoriesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundCategories = await postService.getCategories();

    const foundCategoryList = foundCategories.map((category: any) => category.post_category);

    res
      .status(200)
      .json({ message: '카테고리 조회 성공', data: { categories: foundCategoryList } });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 카테고리 조회 실패'));
    }
  }
};

/* 키워드별 게시글 목록 조회 */
const getSearchedPostsByKeywordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const keyword = req.query.keyword as string;
    const { user_location } = req.body; // Fix : 나중에 jwt로 받기

    if (!keyword) throw new AppError(400, 'keyword를 입력해주세요.');

    if (!user_location) throw new AppError(400, 'user_location를 입력해주세요.');

    const foundPosts = await postService.getSearchedPostsByKeyword(user_location, keyword);

    res.status(200).json({ message: '키워드별 게시글 목록 조회 성공', data: foundPosts });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 키워드별 게시글 목록 조회 실패'));
    }
  }
};

/* 카테고리별 게시글 목록 조회 */
const getAllPostsByLocationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_category } = req.params;
    const { user_location } = req.body; // Fix : 나중에 jwt로 받기

    if (!post_category) throw new AppError(400, 'post_category를 입력해주세요.');

    if (!user_location) throw new AppError(400, 'user_location를 입력해주세요.');

    const foundPosts = await postService.getAllPostsByLocation(user_location, post_category);

    res.status(200).json({ message: '카테고리별 게시글 목록 조회 성공', data: foundPosts });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 카테고리별 게시글 목록 조회 실패'));
    }
  }
};

/* 게시글 및 게시글별 댓글 목록 조회 */
const getPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;

    if (isNaN(Number(post_id))) throw new AppError(400, '유효한 post_id를 입력해주세요.');

    const foundpost = await postService.getPost(parseInt(post_id));

    res.status(200).json({ message: '게시글 조회 성공', data: foundpost });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 게시글 조회 실패'));
    }
  }
};

/* 게시글 등록 */
const addPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { post_category, post_title, post_content } = req.body;
    const imgFileRoot = `http://localhost:3000/api/v1/static/${req.file?.filename}`;

    if (!user_id) throw new AppError(400, 'user_id를 입력해주세요.');

    if (!post_category || !post_title || !post_content)
      throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');

    const postData: createPostInput = {
      user_id,
      post_category,
      post_title,
      post_content,
      post_img: imgFileRoot,
    };

    const createdPost = await postService.addPost(postData);

    res.status(201).json({ message: '게시글 등록 성공', data: createdPost });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 게시글 등록 실패'));
    }
  }
};

/* 게시글 수정 */
const editPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;
    const { post_category, post_title, post_content } = req.body;
    const imgFileRoot = `http://localhost:3000/api/v1/static/${req.file?.filename}`;

    if (isNaN(Number(post_id))) throw new AppError(400, '유효한 post_id를 입력해주세요.');

    // if (!post_category || !post_title || !post_content)
    //   throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');

    const postData: updatePostInput = {
      post_category,
      post_title,
      post_content,
      post_img: imgFileRoot,
    };

    const updatedPost = await postService.editPost(parseInt(post_id), postData);

    res.status(200).json({ message: '게시글 수정 성공', data: updatedPost });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 게시글 수정 실패'));
    }
  }
};

/* 게시글 삭제 */
const removePostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;

    if (isNaN(Number(post_id))) throw new AppError(400, '유효한 post_id를 입력해주세요.');

    const deletedPost = await postService.removePost(parseInt(post_id));

    res.status(200).json({ message: '게시글 삭제 성공', data: { post_id: deletedPost } });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 게시글 삭제 실패'));
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
