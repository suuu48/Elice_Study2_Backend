import { dataSource, db } from '../../config/dbconfig';
import { Pet, User } from '../models';
import { updateDataTrans } from './user.repo';

// petId 입력시 Pet 전체 조회
export const findPetById = async (petId: number): Promise<Pet> => {
  try {
    const [pet]: any = await db.query(
      `
      SELECT *
      FROM pet
      WHERE pet_id = ?`,
      [petId]
    );

    return pet;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Pet 추가
export const createPet = async (
  inputData: Record<string, string | number | boolean>
): Promise<Pet> => {
  try {
    const newColumns = 'pet_name, user_id';
    const newValues = Object.values(inputData)
      .map((value) => (typeof value === 'string' ? `'${value}'` : value))
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
    return Promise.reject(error);
  }
};

// Pet 정보 수정
export const updatePet = async (
  petId: number,
  updateData: Record<string, string | number>
): Promise<Pet> => {
  try {
    const [keys, values] = updateDataTrans(updateData);
    const [update] = await db.query(
      `
          UPDATE review
          SET ${keys.join(', ')}
          WHERE review_id = ?
      `,
      [...values, petId]
    );

    const updatePet = await findPetById(petId);
    return updatePet!;
  } catch (error) {
    console.log(error);
    return Promise.reject(error); // App Error
  }
};

// Pet 정보 소프트 delete
export const softDeletePet = async (petId: number): Promise<Pet> => {
  try {
    const [deletePet] = await db.query(
      `
          Update pet
          SET delete_flag ='1'
          WHERE pet_id = ?`,
      [petId]
    );

    const softDeletePet = await findPetById(petId);

    return softDeletePet!;
  } catch (error) {
    console.log(error);
    return Promise.reject(error); // App Error
  }
};
