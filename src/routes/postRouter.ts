import { Router } from 'express';
import { addPostHandler, getAllPostsHandler, getPostHandler } from '../controllers/postController';

const router = Router();

router.post('/:user_id', addPostHandler);
router.get('/', getAllPostsHandler);
router.get('/:post_id', getPostHandler);

export default router;
