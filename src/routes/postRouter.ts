import { Router } from 'express';
import { isAccessTokenValid } from '../middlewares';
import processImage from '../middlewares/multer';
import {
  foundAllPostOutput,
  foundCategoriesOutput,
  foundPostsOutput,
  foundPostOutput,
  createdPostOutput,
  updatedPostOutput,
} from '../database/models/post.entity';
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
postRouter.get('/', isAccessTokenValid, getAllPostsHandler<foundAllPostOutput>);

/* 게시글 카테고리 조회 */
postRouter.get('/categories', isAccessTokenValid, getCategoriesHandler<foundCategoriesOutput>);

/* 키워드별 게시글 목록 조회 */
postRouter.get('/search', isAccessTokenValid, getSearchedPostsByKeywordHandler<foundPostsOutput>);

/* 카테고리별 게시글 목록 조회 */
postRouter.get(
  '/category/:post_category',
  isAccessTokenValid,
  getAllPostsByLocationHandler<foundPostsOutput>
);

/* 게시글 및 게시글별 댓글 목록 조회 */
postRouter.get('/:post_id', isAccessTokenValid, getPostHandler<foundPostOutput>);

/* 게시글 등록 */
postRouter.post('/:user_id', isAccessTokenValid, processImage, addPostHandler<createdPostOutput>);

/* 게시글 수정 */
postRouter.patch('/:post_id', isAccessTokenValid, processImage, editPostHandler<updatedPostOutput>);

/* 게시글 삭제 */
postRouter.delete('/:post_id', isAccessTokenValid, removePostHandler);

export default postRouter;
