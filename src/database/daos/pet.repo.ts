import { dataSource, db } from '../../config/dbconfig';
import { createPetInput, Pet, updatePetInput } from '../models';
import { updateDataTrans } from './user.repo';

// petId 입력시 Pet 복수 조회
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
    throw error;
  }
};

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

    return pet[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Pet 추가
export const createPet = async (
  inputData: createPetInput
): Promise<Pet> => {
  try {
    const newColumns = 'user_id,pet_name,pet_gender,pet_species,pet_birth, pet_info,pet_img';
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
  updateData: updatePetInput): Promise<Pet> => {
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
    return Promise.reject(error); // App Error
  }
};

// Pet delete
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
    return Promise.reject(error); // App Error
  }
};
