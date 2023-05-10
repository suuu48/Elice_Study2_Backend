// 관리자가 모든 유저정보 추출
import { db } from '../../config/dbconfig';
// Todo: 관리자가 유저정보를 수정할 수 있도록 할것인지 프론트와 상의하기

// 회원 목록 전체 조회 >> Todo: verify도 조회할지 프론트와 상의하기
export const findALlUser = async () => {
  const getColumns = 'user_id, user_name, password, user_nickname, verify, location_user, delete_flag, user_img';
  const [users] = await db.query(`
    SELECT ${getColumns}
    FROM user
    WHERE verify = 'user'`);
  return users;
};

// 유저 정보 hard delete
export const deleteUserByAdmin = async (userId: string) => {
  const [deleteUser] = await db.query(
    `
      DELETE FROM
      user 
      WHERE user_id = ?`,
    [userId]
  );
  return deleteUser;
};
