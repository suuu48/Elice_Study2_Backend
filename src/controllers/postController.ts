import { Request, Response, NextFunction } from 'express';
import { addPost, getAllPosts, getPost } from '../services/postService';
import { AppError } from '../utils/errorHandler';
import { createPostInput, updatePostInput } from '../database/daos/post.repo';

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

/*******  동네별로 조회해야함  *******/
const getAllPostsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundPosts = await getAllPosts();

    res.status(200).json({ message: '전체 게시글 조회 성공', data: foundPosts });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message || null));
  }
};

const getPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post_id = parseInt(req.params.post_id);
    if (!post_id) throw new Error('[ 요청 에러 ] post_id가 필요합니다.');

    const foundpost = await getPost(post_id);

    res.status(200).json({ message: '게시글 조회 성공', data: foundpost });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message));
  }
};

export { addPostHandler, getAllPostsHandler, getPostHandler };
