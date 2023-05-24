import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { createPostInput, updatePostInput } from '../database/models/post.entity';
import * as postService from '../services/postService';

/* 게시글 목록 조회 */
const getAllPostsHandler = async <foundPosts>(
  req: Request,
  res: Response<{ message: string; data: foundPosts[] }>,
  next: NextFunction
) => {
  try {
    const foundPosts: foundPosts[] = await postService.getAllPosts<foundPosts>();

    res.status(200).json({ message: '게시글 목록 조회 성공', data: foundPosts });
  } catch (error) {
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
const getCategoriesHandler = async <categories>(
  req: Request,
  res: Response<{ message: string; data: { categories: categories[] } }>,
  next: NextFunction
) => {
  try {
    const foundCategoryObjectList: categories[] = await postService.getCategories<categories>();

    const foundCategoryList: categories[] = foundCategoryObjectList.map(
      (category) => (category as { post_category: categories }).post_category
    );

    res
      .status(200)
      .json({ message: '카테고리 조회 성공', data: { categories: foundCategoryList } });
  } catch (error) {
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
const getSearchedPostsByKeywordHandler = async <foundPosts>(
  req: Request<
    {},
    {},
    {
      jwtDecoded: {
        location: string;
      };
    },
    { keyword: string }
  >,
  res: Response<{ message: string; data: foundPosts[] }>,
  next: NextFunction
) => {
  try {
    const { keyword } = req.query;
    const user_location = req.body.jwtDecoded.location;

    if (!keyword) throw new AppError(400, 'keyword를 입력해주세요.');

    if (!user_location) throw new AppError(400, 'user_location를 입력해주세요.');

    const foundPosts: foundPosts[] = await postService.getSearchedPostsByKeyword<foundPosts>(
      user_location,
      keyword
    );

    res.status(200).json({ message: '키워드별 게시글 목록 조회 성공', data: foundPosts });
  } catch (error) {
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
const getAllPostsByLocationHandler = async <foundPosts>(
  req: Request<
    { post_category: string },
    {},
    {
      jwtDecoded: {
        location: string;
      };
    }
  >,
  res: Response<{ message: string; data: foundPosts[] }>,
  next: NextFunction
) => {
  try {
    const { post_category } = req.params;
    const user_location = req.body.jwtDecoded.location;

    if (!post_category) throw new AppError(400, 'post_category를 입력해주세요.');

    if (!user_location) throw new AppError(400, 'user_location를 입력해주세요.');

    const foundPosts: foundPosts[] = await postService.getAllPostsByLocation<foundPosts>(
      user_location,
      post_category
    );

    res.status(200).json({ message: '카테고리별 게시글 목록 조회 성공', data: foundPosts });
  } catch (error) {
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
const getPostHandler = async <foundPost>(
  req: Request<{ post_id: string }>,
  res: Response<{ message: string; data: foundPost }>,
  next: NextFunction
) => {
  try {
    const { post_id } = req.params;

    if (isNaN(Number(post_id))) throw new AppError(400, '유효한 post_id를 입력해주세요.');

    const foundpost: foundPost = await postService.getPost<foundPost>(Number(post_id));

    res.status(200).json({ message: '게시글 조회 성공', data: foundpost });
  } catch (error) {
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
const addPostHandler = async <createdPost>(
  req: Request<
    { user_id: string },
    {},
    {
      post_category: string;
      post_title: string;
      post_content: string;
      filename: string | null;
    }
  >,
  res: Response<{ message: string; data: createdPost }>,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const { post_category, post_title, post_content } = req.body;
    const { filename } = req.file || {};

    const imgFileRoot = `http://localhost:5500/api/v1/static/${filename}`;

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

    const createdPost: createdPost = await postService.addPost<createdPost>(postData);

    res.status(201).json({ message: '게시글 등록 성공', data: createdPost });
  } catch (error) {
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
const editPostHandler = async <updatedPost>(
  req: Request<
    { post_id: string },
    {},
    {
      post_category?: string;
      post_title?: string;
      post_content?: string;
      filename?: string | null;
    }
  >,
  res: Response<{ message: string; data: updatedPost }>,
  next: NextFunction
) => {
  try {
    const { post_id } = req.params;
    const { post_category, post_title, post_content } = req.body;
    const { filename } = req.file || {};
    const imgFileRoot = `http://localhost:5500/api/v1/static/${filename}`;

    if (isNaN(Number(post_id))) throw new AppError(400, '유효한 post_id를 입력해주세요.');

    if (!post_category && !post_title && !post_content && !filename)
      throw new AppError(400, '수정하실 정보를 하나 이상 입력해주세요.');

    const postData: updatePostInput = {
      post_category,
      post_title,
      post_content,
      post_img: imgFileRoot,
    };

    const updatedPost: updatedPost = await postService.editPost<updatedPost>(
      Number(post_id),
      postData
    );

    res.status(200).json({ message: '게시글 수정 성공', data: updatedPost });
  } catch (error) {
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
const removePostHandler = async (
  req: Request<{ post_id: string }>,
  res: Response<{ message: string; data: { post_id: number } }>,
  next: NextFunction
) => {
  try {
    const { post_id } = req.params;

    if (isNaN(Number(post_id))) throw new AppError(400, '유효한 post_id를 입력해주세요.');

    const deletedPost = await postService.removePost(Number(post_id));

    res.status(200).json({ message: '게시글 삭제 성공', data: { post_id: deletedPost } });
  } catch (error) {
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
