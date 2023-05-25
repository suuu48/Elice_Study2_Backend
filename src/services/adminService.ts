import { User } from '../database/models';
import * as adminRepo from '../database/daos/admin.repo';
import { AppError } from '../utils/errorHandler';
import fs from 'fs';

// 관리자가 삭제할 유저 조회
export const getUsersInfo = async (): Promise<User[]> => {
  try {
    const foundUsers = await adminRepo.findAllUser();

    if (!foundUsers) throw new AppError(404, '존재하지 않는 아이디입니다.');

    return foundUsers;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 유저 정보 조회 실패');
    }
  }
};
// 유저 삭제
export const deleteUser = async (userId: string): Promise<string> => {
  try {
    const foundUser = await adminRepo.findInfo(userId);

    if (!foundUser) throw new AppError(404, '존재하지 않는 아이디입니다.');

    await removeImage(userId);

    const user_id = await adminRepo.deleteUserByAdmin(userId);

    return user_id;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 유저 삭제 실패');
    }
  }
};

// 유저 계정 복구
export const restoreUser = async (userId: string): Promise<User> => {
  try {
    const foundUser = await adminRepo.findInfo(userId);

    if (!foundUser) throw new AppError(404, '존재하지 않는 아이디입니다.');

    const user = await adminRepo.restoreUser(userId);

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 유저 복구 실패');
    }
  }
};

/* 유저 이미지 로컬 삭제 */
const removeImage = async (user_id: string) => {
  const user = await adminRepo.findInfo(user_id);

  const foundUserImage = (user as { user_img: string }).user_img;

  if (foundUserImage === null) return; // 이미지가 원래 없는 pet일 경우 로컬 삭제 안함

  if (user.user_img) {
    const imgFileName = user.user_img.split('/')[6];

    const filePath = `/Users/지원/Desktop/peepsProject/peeps_back-end/public/${imgFileName}`;
    // const filePath = `/Users/subin/IdeaProjects/peeps_back-end3/public/${imgFileName}`;
    // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
    // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

    fs.unlink(filePath, (error) => {
      if (error) throw new AppError(400, '유저 이미지 삭제 중 오류가 발생했습니다.');
    });
  } else return;
};

// /* 게시글 이미지 로컬 삭제 */
// const removeImage = async (user_id: string) => {
//   const foundUser = await adminRepo.findInfo(user_id);

//   if (foundUser.user_id) {
//     const imgFileName = foundUser.user_img.split('/')[6];

//     const filePath = `/Users/subin/IdeaProjects/peeps_back-end3/public/${imgFileName}`;
//     // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
//     // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

//     fs.unlink(filePath, (error) => {
//       if (error) throw new AppError(400, '유저 이미지 삭제 중 오류가 발생했습니다.');
//     });
//   } else return;
// };
