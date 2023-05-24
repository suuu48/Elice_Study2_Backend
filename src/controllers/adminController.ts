import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/adminService';
import { AppError } from '../utils/errorHandler';

// 전체 유저 조회
export const FindALlHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.jwtDecoded.verify === 'user') throw new AppError(400, '관리자가 아닙니다.');

  try {
    const { adminId } = req.params;

    if (!adminId) throw new Error('[ 요청 에러 ] 아이디를 반드시 입력해야 합니다.');

    const usersInfo = await adminService.getUsersInfo();

    res.status(201).json({ message: '유저 전체 조회 성공', data: usersInfo });
  } catch (error: any) {
    //if (error instanceof AppError) next(error);
    //else {
    console.log(error);
    // next(new AppError(500, error.message));
    // }
  }
};

// 유저 정보 하드 삭제
// 리뷰 삭제
export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.jwtDecoded.verify === 'user') throw new AppError(400, '관리자가 아닙니다.');
  try {
    const { userId } = req.params;
    if (!userId) throw new Error('[ 요청 에러 ] 아이디를 반드시 입력해야 합니다.');

    const user = await adminService.deleteUser(userId);

    res.status(200).json({ message: '유저 삭제 성공', data: user });
  } catch (error: any) {
    console.log(error);
    // if (error instanceof AppError) next(error);
    // else next(new AppError(500, error.message));
  }
};

// 유저 계정 복구
export const restoreUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.jwtDecoded.verify === 'user') throw new AppError(400, '관리자가 아닙니다.');
  try {
    const { userId } = req.params;
    if (!userId) throw new Error('[ 요청 에러 ] 아이디를 반드시 입력해야 합니다.');

    const user = await adminService.restoreUser(userId);

    res.status(200).json({ message: '유저 계정 복구 성고', data: user });
  } catch (error: any) {
    console.log(error);
    // if (error instanceof AppError) next(error);
    // else next(new AppError(500, error.message));
  }
};
