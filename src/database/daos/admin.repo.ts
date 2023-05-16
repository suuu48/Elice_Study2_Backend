import { db } from '../../config/dbconfig';
import { Review, User, Pet } from '../models';
import { findAllInfo } from './user.repo';
import { findReviewById } from './review.repo';
import { findPetById } from './pet.repo';

// 관리자가 모든 유저정보 추출
// 회원 목록 전체 조회 >> Todo: verify도 조회할지
export const findALlUser = async (): Promise<User[]> => {
  try {
    const [users]: any = await db.query(`
      SELECT *
      FROM user
      WHERE verify = 'user'`);
    return users;
  } catch (error) {
    console.log(error);
    return Promise.reject(error); // App Error
  }
};

// 관리자가 삭제할 유저 조회 ( delete_flag 가 1인 유저 전체 조회 )
export const findDeleteUsers = async (): Promise<User[]> => {
  try {
    const [users]: any = await db.query(`
    SELECT *
    FROM user
    WHERE delete_falg = '1'`);
    return users;
  } catch (error) {
    console.log(error);
    return Promise.reject(error); // App Error
  }
};
// 유저 정보 hard delete
export const deleteUserByAdmin = async (userId: string): Promise<User> => {
  try {
    const [deleteUser]: any = await db.query(
      `
      DELETE FROM
      user 
      WHERE user_id = ? AND delete_flag = '1'`,
      [userId]
    );

    // const hardDeleteUser = await findAllInfo(userId); // Todo:정보가 hard Delete이므로 어떤 값을 반환할지 결정
    return deleteUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 관자자에 의해 유저 계정 복구
export const restoreUser = async (userId: string): Promise<User> => {
  try {
    const [updateUser] = await db.query(
      `
          Update user
          SET delete_flag ='0'
          WHERE user_id = ?`,
      [userId]
    );

    const restoreUser = await findAllInfo(userId);
    return restoreUser!;
  } catch (error) {
    console.log(error);
    return Promise.reject(error); // App Error
  }
};

