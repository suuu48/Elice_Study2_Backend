import { db } from '../../config/dbconfig';
import { AppError } from '../../utils/errorHandler';
import { User } from '../models';
import { findAllInfo } from './user.repo';

// userId 입력시 모든 정보 추출
// Todo : 이름 변경하기!!!!!!!!
export const findInfo = async (userId: string): Promise<User> => {
  try {
    const [row]: any = await db.query(
      `
    SELECT *
    FROM user
    WHERE user_id = ?`,
      [userId]
    );

    return row[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 유저 정보 조회 실패');
  }
};

// 관리자가 모든 유저정보 추출
// 회원 목록 전체 조회
export const findALlUser = async (): Promise<User[]> => {
  try {
    const [users]: any = await db.query(`
      SELECT *
      FROM user
      WHERE verify = 'user'`);

    return users;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 목록 전체 조회 실패');
  }
};

// 관리자가 삭제할 유저 조회 ( delete_flag 가 1인 유저 전체 조회 )
export const findDeleteUsers = async (): Promise<User[]> => {
  try {
    const [users]: any = await db.query(`
    SELECT *
    FROM user
    WHERE delete_flag = '1'`);

    return users;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 탈퇴 목록 조회 실패');
  }
};
// 유저 정보 hard delete
export const deleteUserByAdmin = async (userId: string): Promise<string> => {
  try {
    const [deleteUser]: any = await db.query(
      `
      DELETE FROM
      user 
      WHERE user_id = ? AND delete_flag = '1'`,
      [userId]
    );

    return userId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 유저 정보 삭제 실패');
  }
};

// 관자자에 의해 유저 계정 복구
export const restoreUser = async (userId: string): Promise<User> => {
  try {
    const [updateUser] = await db.query(
      `
          Update user
          SET delete_flag ='0', deleted_at = null
          WHERE user_id = ?`,
      [userId]
    );

    const restoreUser = await findAllInfo(userId);

    return restoreUser!;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 유저 계정 복구 실패');
  }
};
