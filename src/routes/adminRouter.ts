import express from 'express';
import * as adminController from '../controllers/adminController';
import { isAccessTokenValid } from '../middlewares';
export const adminRoute = express();

// 유저 전체 조회
adminRoute.get('/:adminId', isAccessTokenValid, adminController.FindALlHandler);

// 유저 정보 hard delete
adminRoute.delete('/:userId', isAccessTokenValid, adminController.deleteUserHandler);

// 유저정보 복구
adminRoute.get('/rollback/:userId', isAccessTokenValid, adminController.restoreUserHandler);
