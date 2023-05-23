import express from 'express';
import * as userController from '../controllers/userController';
import { isAccessTokenValid } from '../middlewares';
import processImage from '../middlewares/multer';
//import * as user from "../services/user.service";
export const userRoute = express();

// 회원가입
userRoute.post('/register', processImage, userController.addUserHandler);

// 로그인
userRoute.post('/logIn', userController.logIn);

// 유저정보 조회
userRoute.get('/:userId', isAccessTokenValid, userController.getUserInfo);

// 유저정보 수정
userRoute.post('/up/:userId', processImage, isAccessTokenValid, userController.updateUserHandler);

// 유저 소프트 삭제
userRoute.post('/sd/:userId', isAccessTokenValid, userController.softDeleteUserHandler);
