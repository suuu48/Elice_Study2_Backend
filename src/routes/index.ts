import express from 'express';

import { userRoute } from './user.router';
import { reviewRoute } from './review.router';
import { adminRoute } from './admin.router';

const v1Router = express.Router();

v1Router.use('/user', userRoute);
v1Router.use('/review', reviewRoute);
v1Router.use('/admin', adminRoute);
