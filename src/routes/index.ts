import express from 'express';

import rootRouter from './rootRouter';
import { userRoute } from './userRouter';
import { reviewRoute } from './reviewRouter';
import { adminRoute } from './adminRouter';
import { petRoute } from './petRouter';
import postRouter from './postRouter';
import commentRouter from './commentRouter';

const v1Router = express.Router();
const staticRouter = express.static('public');

v1Router.use('/', rootRouter);

v1Router.use('/static', staticRouter);
v1Router.use('/user', userRoute);
v1Router.use('/review', reviewRoute);
v1Router.use('/admin', adminRoute);
v1Router.use('/pet', petRoute);
v1Router.use('/post', postRouter);
v1Router.use('/comment', commentRouter);

export { v1Router };
