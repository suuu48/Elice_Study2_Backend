import { Router } from 'express';
import processImage from '../middlewares/multer';
import { getPostsOutput } from '../database/models/post.entity';
import {
  getAllPostsHandler,
  getCategoriesHandler,
  getSearchedPostsByKeywordHandler,
  getAllPostsByLocationHandler,
  getPostHandler,
  addPostHandler,
  editPostHandler,
  removePostHandler,
} from '../controllers/postController';

const postRouter = Router();

/* 게시글 목록 조회 */
postRouter.get('/', getAllPostsHandler);

/* 게시글 카테고리 조회 */
postRouter.get('/categories', getCategoriesHandler);

/* 키워드별 게시글 목록 조회 */
postRouter.get('/search', getSearchedPostsByKeywordHandler<getPostsOutput>);

/* 카테고리별 게시글 목록 조회 */
postRouter.get('/category/:post_category', getAllPostsByLocationHandler<getPostsOutput>);

/* 게시글 및 게시글별 댓글 목록 조회 */
postRouter.get('/:post_id', getPostHandler);

/* 게시글 등록 */
postRouter.post('/:user_id', processImage, addPostHandler);

/* 게시글 수정 */
postRouter.patch('/:post_id', processImage, editPostHandler);

/* 게시글 삭제 */
postRouter.delete('/:post_id', removePostHandler);

export default postRouter;
