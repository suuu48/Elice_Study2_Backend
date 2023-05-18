import express from 'express';
import * as adminController from '../controllers/adminController';
export const adminRoute = express();

// 관리자가 삭제할 유저 조회
adminRoute.get('/:adminId', adminController.deleteFindUserHandler);

// 유저 정보 hard delete
adminRoute.delete('/:userId', adminController.deleteUserHandler);

// 유저정보 복구
adminRoute.post('/:userId', adminController.restoreUserHandler);
