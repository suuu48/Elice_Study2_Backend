import { Request, Response } from 'express';
import { createPost, findPosts } from '../database/daos/post.repo';

const addPost = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const { post_category, post_title, post_content } = req.body;

    const postData = {
      user_id,
      post_category,
      post_title,
      post_content,
    };

    const post = await createPost(postData);
    res.status(201).json(post);
  } catch (error) {
    throw new Error('[ 서버 에러 ]: 게시글 생성 실패'); // App Error
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const post = await findPosts();
    res.status(201).json(post);
  } catch (error) {
    throw new Error('[ 서버 에러 ]: 게시글 전체 조회 실패'); // App Error
  }
};

export { addPost, getAllPosts };
