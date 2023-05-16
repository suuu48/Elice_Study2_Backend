import { Router } from 'express';
import {
  addPostHandler,
  getCategoriesHandler,
  getAllPostsHandler,
  getAllPostsByLocationHandler,
  getPostHandler,
} from '../controllers/postController';

const router = Router();

/* 게시글 생성 */
router.post('/:user_id', addPostHandler);

/* 게시글 카테고리 조회 */
router.get('/categories', getCategoriesHandler);

/* 게시글 목록 조회 */
// router.get('/', getAllPostsHandler);

/* 카테고리별 게시글 목록 조회 */
router.get('/category/:post_category', getAllPostsByLocationHandler);

/* post_id로 게시글 조회 */
router.get('/:post_id', getPostHandler);

export default router;
