import { User } from '../database/models';
import * as adminRepo from '../database/daos/admin.repo';
import * as userRepo from '../database/daos/user.repo';
import { AppError } from '../utils/errorHandler';

// 관리자가 삭제할 유저 조회
export const getUsersInfo = async (): Promise<User[]> => {
  try {
    const foundUsers = await adminRepo.findDeleteUsers();
    if (!foundUsers)
      throw new AppError(404, '존재하지 않는 아이디입니다.');

    return foundUsers;
  } catch (error: any) {
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
    const foundUser = await userRepo.findOne(userId);
    if (!foundUser)
      throw new AppError(404, '존재하지 않는 아이디입니다.');

    const user_id = await adminRepo.deleteUserByAdmin(userId);
    return user_id;
  } catch (error: any) {
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
    const foundUser = await userRepo.findOne(userId);

    if (!foundUser)
      throw new AppError(404, '존재하지 않는 아이디입니다.');

    const user = await adminRepo.restoreUser(userId);
    return user;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 유저 복구 실패');
    }
  }
};
