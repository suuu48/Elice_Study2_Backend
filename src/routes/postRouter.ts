import { Router } from 'express';
import { addPost, getAllPosts } from '../services/postService';

const router = Router();

router.post('/write', addPost);

router.get('/list', getAllPosts);

export default router;
