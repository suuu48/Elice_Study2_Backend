import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import * as User from '../database/models';
import bcrypt from 'bcrypt';
import * as userRepo from '../database/daos/user.repo';
import { AppError } from '../utils/errorHandler';

// 유저 추가
export const addUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, user_name, user_password, user_nickname, user_location } = req.body;

    const imgFileRoot = `http://localhost:5500/api/v1/static/${
      req.file?.filename === undefined ? 'ecm.png' : req.file?.filename
    }`;
    if (!user_id || !user_name || !user_password || !user_nickname || !user_location)
      throw new Error('[ 요청 에러 ] 사진을 제외한 모든 필드를 입력해야 합니다.');

    const isCheckId = await userRepo.findOne(user_id);

    if (isCheckId) {
      throw Error('이 아이디는 현재 사용중입니다. 다른 아이디를 입력해 주세요.');
    }

    // 닉네임 중복체크
    const isCheckNickname = await userRepo.findOneByNickname(user_nickname);
    if (isCheckNickname) {
      throw Error('이 닉네임은 현재 사용중입니다. 다른 닉네임을 입력해 주세요.');
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);
    const userData: User.createUserInput = {
      user_id,
      user_name,
      user_password: hashedPassword,
      user_nickname,
      user_location,
      user_img: imgFileRoot,
    };

    const createdUser = await userService.createUser(userData);
    res.status(201).json({ message: '유저 등록 성공', data: createdUser });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      throw new AppError(500, '[ HTTP 요청 에러 ] 유저 등록 실패');
    }
  }
};

// 로그인
export const logIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, user_password } = req.body;

    if (!user_id || !user_password)
      throw new Error('[ 요청 에러 ] 아이디와 비밀번호를 반드시 입력해야 합니다.');

    const checkId = await userRepo.findAllInfo(user_id);
    if (!checkId) {
      throw Error('해당 아이디는 가입 내역이 없습니다. 다른 아이디를 입력해 주세요.');
    }

    const correctPasswordHash = checkId.user_password; // db에 저장되어 있는 암호화된 비밀번호

    if (correctPasswordHash !== user_password) {
      const isPasswordCorrect = await bcrypt.compare(user_password, correctPasswordHash);
      if (!isPasswordCorrect) {
        throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
      }
    }

    const userToken = await userService.getUserToken(checkId.user_id);

    res.status(201).json({
      message: '로그인 성공',
      data: {
        userToken,
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      throw new AppError(500, '[ HTTP 요청 에러 ] 로그인 실패');
    }
  }
};

// 유저 정보 조회
export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!userId) throw new Error('[ 요청 에러 ] 아이디를 반드시 입력해야 합니다.');

    const userInfo = await userService.getUser(userId);

    res.status(201).json({ message: '유저 정보 조회 성공', data: userInfo });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      throw new AppError(500, '[ HTTP 요청 에러 ] 유저 정보 조회 실패');
    }
  }
};

// 유저 정보 수정
export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const imgFileRoot = `http://localhost:5500/api/v1/static/${req.file?.filename}`;

    if (!userId) throw new Error('[ 요청 에러 ] 아이디를 반드시 입력해야 합니다.');

    const { user_name, user_nickname, user_location } = req.body;

    if (!user_name && !user_nickname && !user_location)
      throw new Error('[ 요청 에러 ] 변경된 값이 없습니다!');

    const updateUserData: User.updateUserInput = {
      user_name,
      user_nickname,
      user_location,
      user_img: imgFileRoot,
    };

    const userInfo = await userService.updateUserInfo(userId, updateUserData);

    res.status(201).json({ message: '유저 수정 성공', data: userInfo });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      throw new AppError(500, '[ HTTP 요청 에러 ] 유저 수정 실패');
    }
  }
};

// 유저 soft 삭제
export const softDeleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (!userId) throw new Error('[ 요청 에러 ] 아이디를 반드시 입력해야 합니다.');

    const user = await userService.softDelete(userId);
    const returnUserId = user.user_id;
    res.status(200).json({ message: '유저 소프트 삭제 성공', data: returnUserId });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      throw new AppError(500, '[ HTTP 요청 에러 ] 유저 소프트 삭제 실패');
    }
  }
};
