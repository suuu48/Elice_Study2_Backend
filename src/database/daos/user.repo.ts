import { db } from '../../config/dbconfig';
import { createUserInput, updateUserInput, User, UserProfile } from '../models';
import { AppError } from '../../utils/errorHandler';

// 닉네임 중복 체크
export const findOneByNickname = async (nickName: string): Promise<UserProfile> => {
  try {
    const [row]: any = await db.query(
      `
    SELECT *
    FROM user
    WHERE user_nickname = ?`,
      [nickName]
    );

    return row[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 닉네임 중복 체크 실패');
  }
};

// userId 입력시 password,verify,delete_flag 제외한 user 정보 추출
export const findOne = async (userId: string): Promise<UserProfile> => {
  try {
    const getColumns = 'user_id, user_name, user_nickname, user_location, user_img';

    const [row]: any = await db.query(
      `
    SELECT ${getColumns}
    FROM user
    WHERE user_id = ? and delete_flag ='0'`,
      [userId]
    );

    return row[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 유저 프로필 정보 조회 실패');
  }
};
// userId 입력시 user 정보 추출
export const findAllInfo = async (userId: string): Promise<User> => {
  try {
    const [row]: any = await db.query(
      `
    SELECT *
    FROM user
    WHERE user_id = ? and delete_flag ='0'`,
      [userId]
    );

    return row[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 유저 전체 정보 조회 실패');
  }
};

// userId 입력시 user 정보 추출
export const findForDelete = async (userId: string): Promise<User> => {
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
    throw new AppError(500, '[ DB 에러 ] 유저(탈퇴 유저 포함) 전체 정보 조회 실패');
  }
};

// 회원가입
export const createUser = async (inputData: createUserInput): Promise<User> => {
  try {
    const newColumns = 'user_id, user_name, user_password, user_nickname, user_location, user_img';

    const newValues = Object.values(inputData)
      .map((value) => {
        if (value === null) return 'DEFAULT';
        else if (typeof value === 'string') return `'${value}'`;
        else return value;
      })
      .join(', ');

    const [newUser]: any = await db.query(
      `
          INSERT INTO user (${newColumns})
          VALUES (${newValues})
      `
    );

    const createUserId = String(inputData.user_id);

    const createuser = await findAllInfo(createUserId);

    return createuser!;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 회원 가입 실패');
  }
};

// update의 경우 key값과 value값을 매칭 시켜줌
export const updateDataTrans = (input: Record<string, string | number | boolean | Date | null>) => {
  const data = Object.entries(input)
    .filter(([_, value]) => value !== undefined)
    .reduce(
      (a, [key, value]) => {
        a[0].push(`${key} = ?`);
        a[1].push(value);
        return a;
      },
      [[], []] as [string[], Array<string | number | boolean | Date | null>]
    );

  return data;
};

// 유저 정보 수정 >> Todo : 프론트와 상의 후 어떤 것을 수정 가능하게 할지 정하기!
export const updateUser = async (userId: string, updateData: updateUserInput): Promise<User> => {
  try {
    const [keys, values] = updateDataTrans(updateData);

    const [updateUser, _]: any = await db.query(
      `
          UPDATE user
          SET ${keys.join(', ')}
          WHERE user_id = ?
      `,
      [...values, userId]
    );

    const updateuser = await findAllInfo(userId);

    return updateuser!;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 유저 정보 수정 실패');
  }
};

// 유저 정보 소프트 delete
export const softDeleteUser = async (userId: string): Promise<User> => {
  try {
    const [updateUser]: any = await db.query(
      `   Update user
          SET delete_flag ='1', deleted_at=Now()
          WHERE user_id = ?`,
      [userId]
    );

    const user = await findForDelete(userId);

    return user!;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 유저 소프트 삭제 실패');
  }
};
