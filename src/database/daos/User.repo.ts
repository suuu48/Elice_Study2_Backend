import { dataSource, db } from '../../config/dbconfig';

// userId 입력시 password,verify,delete_flag 제외한 user 정보 추출
export const findOne = async (userId: string) => {
  const getColumns = 'user_id, user_name, user_nickname, location_user, user_img';
  const [users] = await db.query(
    `
    SELECT ${getColumns}
    FROM user
    WHERE user_id = ?`,
    [userId]
  );
  return users;
};

// 유저 추가
export const create = async (data: Record<string, string | number>) => {
  const newColumns = 'user_id, user_name, user_nickname, location_user, user_img';
  console.log(data);
  // const { user_id, username, user_nickname, location_user,user_img } = data;
  const [newUser] = await db.query(
    `
      INSERT INTO 
      user (${newColumns})
      VALUES (${data})
    `
  );
  return newUser;
};

// 유저 정보 수정 >> Todo: 프론트와 상의 후 어떤 것을 수정 가능하게 할지 정하기!
export const update = async (data: Record<string, string | number>) => {
  const updateColumns = 'user_id, user_name, user_password user_nickname, location_user, user_img';
  console.log(data);
  const [updateUser] = await db.query(
    `
        Update user
        SET (${updateColumns})
        VALUES (${data})
    `
  );
  return updateUser;
};

// 유저 정보 소프트 delete
export const softDelete = async (userId: string) => {
  const [updateUser] = await db.query(
    `
      Update user 
      SET delete_flag
      VALUES ('1') 
      WHERE user_id = ?`,
    [userId]
  );
  return updateUser;
};
