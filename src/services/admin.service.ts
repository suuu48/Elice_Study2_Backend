import { User } from '../database/models';
import * as adminRepo from '../database/daos/admin.repo';
import * as userRepo from '../database/daos/user.repo';

// 관리자가 삭제할 유저 조회
export const getUsersInfo = async (): Promise<User[]> => {
  try {
    const foundUsers = await adminRepo.findDeleteUsers();
    if (!foundUsers) console.log('삭제할 유저가 없습니다!');
    //return next(new AppError(400, '존재하지 않는 아이디입니다.'));

    return foundUsers;
  } catch (error) {
    console.error(error);
    throw new Error('[유저 정보 조회 에러] 삭제 할 유저 정보 조회에 실패했습니다.');
    //  next(error);
  }
};
// 유저 삭제
export const deleteUser = async (userId: string): Promise<User> => {
  try {
    const foundUser = await userRepo.findOne(userId);
    if (!foundUser) console.log('존재하지 않는 아이디 입니다.');

    const deleteUser = await adminRepo.deleteUserByAdmin(userId);
    return deleteUser;
  } catch (error: any) {
    console.log(error);
    throw new Error('유저 삭제에 실패했습니다.'); // Todo: if..else 문으로 변경하기
    // if (error instanceof AppError) throw error;
    // else throw new AppError(404, error.message);
  }
};

// 유저 계정 복구
export const restoreUser = async (userId: string): Promise<User> => {
  try {
    const foundUser = await userRepo.findOne(userId);
    if (!foundUser) console.log('존재하지 않는 아이디 입니다.');

    const user = await adminRepo.restoreUser(userId);
    return user;
  } catch (error: any) {
    console.log(error);
    throw new Error('유저 복구에 실패했습니다.'); // Todo: if..else 문으로 변경하기
    // if (error instanceof AppError) throw error;
    // else throw new AppError(404, error.message);
  }
};
