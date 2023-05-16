import { Router } from 'express';
import {
  getAllPostsHandler,
  getCategoriesHandler,
  getAllPostsByLocationHandler,
  getPostHandler,
  addPostHandler,
  editPostHandler,
  removePostHandler,
} from '../controllers/postController';

const router = Router();

/* 게시글 목록 조회 */
// router.get('/', getAllPostsHandler);

/* 게시글 카테고리 조회 */
router.get('/categories', getCategoriesHandler);

/* 카테고리별 게시글 목록 조회 */
router.get('/category/:post_category', getAllPostsByLocationHandler);

/* post_id로 게시글 조회 */
router.get('/:post_id', getPostHandler);

/* 게시글 생성 */
router.post('/:user_id', addPostHandler);

/* post_id로 특정 게시글 수정 */
router.patch('/:post_id', editPostHandler);

/* 게시글 삭제 */
router.delete('/:post_id', removePostHandler);

export default router;
