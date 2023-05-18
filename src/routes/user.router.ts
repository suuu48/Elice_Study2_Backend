import express from 'express';
import * as userController from '../controllers/userController';
//import * as user from "../services/user.service";
export const userRoute = express();

// 회원가입
userRoute.get('/register', userController.addUserHandler);

// 로그인
userRoute.get('/logIn', userController.logIn);

// 유저정보 조회
userRoute.get('/:userId', userController.getUserInfo);

// 유저정보 수정
userRoute.post('/:userId', userController.updateUserHandler);

// 유저 소프트 삭제
userRoute.post('/sd/:userId', userController.softDeleteUserHandler);
