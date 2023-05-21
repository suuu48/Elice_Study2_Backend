import { Router } from 'express';
import processImage from '../middlewares/multer';
import * as postController from '../controllers/postController';

const postRouter = Router();

/* 게시글 목록 조회 */
postRouter.get('/', postController.getAllPostsHandler);

/* 게시글 카테고리 조회 */
postRouter.get('/categories', postController.getCategoriesHandler);

/* 키워드별 게시글 목록 조회 */
postRouter.get('/search', postController.getSearchedPostsByKeywordHandler);

/* 카테고리별 게시글 목록 조회 */
postRouter.get('/category/:post_category', postController.getAllPostsByLocationHandler);

/* 게시글 및 게시글별 댓글 목록 조회 */
postRouter.get('/:post_id', postController.getPostHandler);

/* 게시글 등록 */
postRouter.post('/:user_id', processImage, postController.addPostHandler);

/* 게시글 수정 */
postRouter.patch('/:post_id', processImage, postController.editPostHandler);

/* 게시글 삭제 */
postRouter.delete('/:post_id', postController.removePostHandler);

export default postRouter;
