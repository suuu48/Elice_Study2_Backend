import jwt from 'jsonwebtoken';
import * as userRepo from '../database/daos/user.repo';
import { createUserInput, updateUserInput, User, UserProfile } from '../database/models';
import { env } from '../config/envconfig';
import fs from 'fs';
import { AppError } from '../utils/errorHandler';

// 회원가임
export const createUser = async (inputData: createUserInput) => {
  try {
    const newUser = await userRepo.createUser(inputData);

    const user = await userRepo.findOne(newUser.user_id);
    if (!user) throw new Error('[ 유저 가입 에러 ] 가입된 유저를 찾을 수 없습니다.');

    return user;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(500, error.message || null);
    }
  }
};

// 로그인
export const getUserToken = async (
  userId: string
): Promise<{ userInfo: UserProfile; accessToken: string; refreshToken: string }> => {
  try {
    const user = await userRepo.findAllInfo(userId);

    // 로그인 시작 -> JWT 웹 토큰 생성
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
    const userInfo = await userRepo.findOne(userId);
    return { userInfo, accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw new Error('[JWT 토큰 에러] 토큰 발급에 실패했습니다.');
  }
};

// 유저 정보 조회
export const getUser = async (userId: string): Promise<UserProfile> => {
  try {
    const foundUser = await userRepo.findOne(userId);
    if (!foundUser) throw new AppError(404, '존재하지 않는 아이디 입니다.');

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
): Promise<UserProfile> => {
  try {
    const foundUser = await userRepo.findOne(userId);
    if (!foundUser) throw new AppError(404, '존재하지 않는 아이디 입니다.');

    await editImage(userId, updateData);

    const updateUser = await userRepo.updateUser(userId, updateData);
    const user = await userRepo.findOne(updateUser.user_id);
    return user;
  } catch (error) {
    console.error(error);
    throw new Error('[유저 수정 에러] 유저 정보 수정에 실패했습니다.');
  }
};

// 유저 소프트 삭제
export const softDelete = async (userId: string): Promise<User> => {
  try {
    const foundUser = await userRepo.findOne(userId);
    if (!foundUser) throw new AppError(404, '존재하지 않는 아이디 입니다.');

    const deleteUser = await userRepo.softDeleteUser(userId);
    return deleteUser;
  } catch (error: any) {
    console.log(error);
    throw new Error('유저 삭제에 실패했습니다.');
    if (error instanceof AppError) throw error;
    else throw new AppError(404, error.message);
  }
};

// /* 유저 이미지 로컬 수정 */
// const editImage = async (user_id: string, inputData: updateUserInput) => {
//   const foundUser = await userRepo.findOne(user_id);
//   if (!foundUser) throw new AppError(404, '존재하지 않는 아이디 입니다.');

//   if (foundUser.user_img && foundUser.user_img !== inputData.user_img) {
//     const imgFileName = foundUser.user_img.split('/')[6];

//     const filePath = `/Users/subin/IdeaProjects/peeps_back-end3/public/${imgFileName}`;
//     // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
//     // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

//     fs.unlink(filePath, (error) => {
//       if (error) throw new AppError(400, '유저 이미지 수정 중 오류가 발생했습니다.');
//     });
//   } else return;
// };

/* 유저 이미지 로컬 수정 */
const editImage = async (user_id: string, updateData: updateUserInput) => {
  if (updateData.user_img === undefined) return; // 수정할 이미지가 없는 경우 로컬 삭제 안함

  const user = await userRepo.findOne(user_id);

  const foundUserImage = (user as { user_img: string }).user_img;

  if (foundUserImage === null) return; // 이미지가 원래 없는 유저일 경우 로컬 삭제 안함

  // 이미지가 있는 유저일 경우
  if (foundUserImage) {
    if (foundUserImage === updateData.user_img)
      return; // 수정할 이미지가 동일한 경우 로컬 삭제 안함
    else if (foundUserImage !== updateData.user_img) {
      // 수정할 이미지가 기존과 다른 경우 로컬 삭제
      const imgFileName = foundUserImage.split('/')[6];

      const filePath = `/Users/지원/Desktop/peepsProject/peeps_back-end/public/${imgFileName}`;
      // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
      // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

      fs.unlink(filePath, (error) => {
        if (error) throw new AppError(400, '유저 이미지 수정 중 오류가 발생했습니다.');
      });
    }
  } else return; // 그 외의 경우 로컬 삭제 안함
};
