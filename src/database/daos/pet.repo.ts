import { db } from '../../config/dbconfig';
import { AppError } from '../../utils/errorHandler';
import { createPetInput, Pet, updatePetInput } from '../models';
import { updateDataTrans } from './user.repo';

// petId 입력시 Pet 목록 조회
export const findPets = async (user_id: string): Promise<Pet[]> => {
  try {
    const [pets]: any = await db.query(
      `
      SELECT *
      FROM pet
      WHERE user_id = ?`,
      [user_id]
    );

    return pets;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 유저 펫 목록 조회 실패');
  }
};

// petId 입력시 Pet 정보 조회
export const findPetById = async (petId: number): Promise<Pet> => {
  try {
    const [pet]: any = await db.query(
      `
      SELECT *
      FROM pet
      WHERE pet_id = ?`,
      [petId]
    );

    return pet[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 펫 정보 조회 실패');
  }
};

// Pet 등록
export const createPet = async (inputData: createPetInput): Promise<Pet> => {
  try {
    const newColumns = 'user_id,pet_name,pet_gender,pet_species,pet_birth, pet_info,pet_img';

    const newValues = Object.values(inputData)
      .map((value) => {
        if (value === null) return 'DEFAULT';
        else if (typeof value === 'string') return `'${value}'`;
        else return value;
      })
      .join(', ');

    const [newPet] = await db.query(
      `
          INSERT INTO pet (${newColumns})
          VALUES (${newValues})
      `
    );

    const createdPetId = (newPet as { insertId: number }).insertId;

    const createPet = await findPetById(createdPetId);

    return createPet!; // null일 가능성이 없음을 !로 명시적 선언함
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 펫 등록 실패');
  }
};

// Pet 정보 수정
export const updatePet = async (petId: number, updateData: updatePetInput): Promise<Pet> => {
  try {
    const [keys, values] = updateDataTrans(updateData);

    const [update] = await db.query(
      `
          UPDATE pet
          SET ${keys.join(', ')}
          WHERE pet_id = ?
      `,
      [...values, petId]
    );

    const pet = await findPetById(petId);

    return pet!;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 펫 정보 수정 실패');
  }
};

// Pet 삭제
export const deletePet = async (petId: number): Promise<number> => {
  try {
    const [deletePet] = await db.query(
      `
          DELETE FROM
              pet
          WHERE pet_id = ?`,
      [petId]
    );

    return petId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 펫 삭제 실패');
  }
};
