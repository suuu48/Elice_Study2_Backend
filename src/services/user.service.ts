import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepo from '../database/daos/user.repo';

// 회원가임
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password, userName, userNickname, locationUser, userImg } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      userId,
      password: hashedPassword,
      userName,
      userNickname,
      locationUser,
      userImg,
    };

    // 아이디 중복체크
    const foundId = await userRepo.findOne(userId);
    if (foundId) {
      throw Error('이 아이디는 현재 사용중입니다. 다른 아이디를 입력해 주세요.');
    }

    // 닉네임 중복체크
    const checkNickname = await userRepo.findOneByNickname(userId);
    if (checkNickname) {
      throw Error('이 닉네임은 현재 사용중입니다. 다른 닉네임을 입력해 주세요.');
    }

    const newUser = await userRepo.createUser(data);

    res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
  }
};

// 로그인
export const logIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password } = req.body;
    if (!userId) {
      console.log('아이디를 입력해주세요.');
      //return next(new AppError(400, '아이디를 입력해주세요.'));
    }
    if (!password) {
      console.log('비밀번호를 입력해주세요.');
      // return next(new AppError(400, '비밀번호를 입력해주세요.'));
    }

    const foundUser = await userRepo.findAllInfo(userId);
    if (!foundUser) console.log('존재하지 않는 아이디 입니다.');

    const correctPasswordHash = foundUser.user_password; // db에 저장되어 있는 암호화된 비밀번호

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);

    if (!isPasswordCorrect) {
      throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
    }
    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    const accessToken = jwt.sign(
      { id: foundUser.user_id, password: foundUser.user_password, verify: foundUser.verify },
      secretKey
    );

    res.status(200).json({
      message: '로그인 성공',
      data: {
        userId: foundUser.user_id,
        userName: foundUser.user_name,
        userNickname: foundUser.user_nickname,
        userLocation: foundUser.user_location,
        userImg: foundUser.user_img,
        accessToken,
        // refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

// 유저 정보 조회
export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      console.log('아이디를 입력해주세요.');
      //return next(new AppError(400, '아이디를 입력해주세요.'));
    }

    const foundUser = await userRepo.findOne(userId);
    if (!foundUser) console.log('존재하지 않는 아이디 입니다.'); //Todo: repo에서 에러처리하기
    //return next(new AppError(400, '존재하지 않는 아이디입니다.'));

    res.status(200).json({
      message: '회원정보',
      data: foundUser,
    });
    // res.status(200).json(foundUser); // Todo: 어떻게 반환할지 결정하기
  } catch (error) {
    console.error(error);
    next(error);
  }
};
