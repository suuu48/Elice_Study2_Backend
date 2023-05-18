import jwt from 'jsonwebtoken';
import * as userRepo from '../database/daos/user.repo';
import { createUserInput, updateUserInput, User, UserProfile } from '../database/models';
import { env } from '../config/envconfig';

// 회원가임
export const register = async (inputData: createUserInput) => {
  // Todo : register >> createUser로 변경
  try {
    const newUser = await userRepo.createUser(inputData);

    const user = await userRepo.findOne(newUser.user_id);
    if (!user) throw new Error('[ 유저 가입 에러 ] 가입된 유저를 찾을 수 없습니다.');

    return user;
  } catch (error: any) {
    //if (error instanceof AppError) throw error;
    // else {
    console.log(error);
    // throw new AppError(500, error.message || null);
    // }
  }
};

// 로그인
export const getUserToken = async (
  userId: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  try {
    const user = await userRepo.findInfo(userId);
    // 로그인 성공 -> JWT 웹 토큰 생성
    // const secretKey = env.JWT_SECRET_KEY || 'secret-key';
    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'default-access-token-secret';
    const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'default-refresh-token-secret';

    const payload = {
      userId: user.user_id,
      password: user.user_password,
      verify: user.verify,
      location: user.user_location,
    };

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw new Error('[JWT 토큰 에러] 토큰 발급에 실패했습니다.');
  }
};

// 유저 정보 조회
export const getUser = async (userId: string): Promise<UserProfile> => {
  try {
    const foundUser = await userRepo.findOne(userId);
    if (!foundUser) console.log('존재하지 않는 아이디 입니다.');
    //return next(new AppError(400, '존재하지 않는 아이디입니다.'));

    return foundUser;
  } catch (error) {
    console.error(error);
    throw new Error('[유저 정보 조회 에러] 정보 조회에 실패했습니다.');
    //  next(error);
  }
};

// 유저 정보 수정
export const updateUserInfo = async (
  userId: string,
  updateData: updateUserInput
): Promise<User> => {
  try {
    const foundUser = await userRepo.findOne(userId);
    if (!foundUser) console.log('존재하지 않는 아이디 입니다.');
    //return next(new AppError(400, '존재하지 않는 아이디입니다.'));

    const updateUser = await userRepo.updateUser(userId, updateData);
    return updateUser;
  } catch (error) {
    console.error(error);
    throw new Error('[유저 수정 에러] 유저 정보 수정에 실패했습니다.');
    //  next(error);
  }
};

// 유저 소프트 삭제
export const softDelete = async (userId: string): Promise<User> => {
  try {
    const foundUser = await userRepo.findOne(userId);
    if (!foundUser) console.log('존재하지 않는 아이디 입니다.');

    const deleteUser = await userRepo.softDeleteUser(userId);
    return deleteUser;
  } catch (error: any) {
    console.log(error);
    throw new Error('유저 삭제에 실패했습니다.'); // Todo: if..else 문으로 변경하기
    // if (error instanceof AppError) throw error;
    // else throw new AppError(404, error.message);
  }
};
