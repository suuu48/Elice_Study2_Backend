import { Pet } from '../database/models/pet.entity';
import { createPetInput, updatePetInput } from '../database/models';
import * as petRepo from '../database/daos/pet.repo';
import { AppError } from '../utils/errorHandler';
import { createPet, findPetById, findPets } from '../database/daos/pet.repo';

// pet 등록
export const addPet = async (inputData: createPetInput) => {
  try {
    const createdPet = await petRepo.createPet(inputData);

    const newPet = await petRepo.findPetById(createdPet.pet_id);
    if (!newPet) throw new Error('[ 펫 등록 에러 ] 등록된 펫이 없습니다.');

    return newPet;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
    throw new AppError(500, error.message || null);
    }
  }
};

// 특정 pet 조회
export const getALlPet = async (user_id: string): Promise<Pet[]> => {
  try {
    const pets = await petRepo.findPets(user_id);

    if (pets === undefined) throw new Error('[ pet 조회 에러 ] pet이 존재하지 않습니다.');

    return pets;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      throw new AppError(500, error.message || null);
    }
  }
};


// 특정 pet 조회
export const getPet = async (pet_id: number): Promise<Pet> => {
  try {
    const pet = await petRepo.findPetById(pet_id);

    if (pet === undefined) throw new Error('[ pet 조회 에러 ] pet이 존재하지 않습니다.');

    return pet;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      throw new AppError(500, error.message || null);
    }
  }
};

// pet 수정
export const updatePet = async (
  pet_id: number,
  updateData: updatePetInput
): Promise<Pet> => {
  try {
    const pet = await petRepo.findPetById(pet_id);

    if (pet === undefined) throw new Error('[ pet 수정 에러 ] pet이 존재하지 않습니다.');

    const updatePet = await petRepo.updatePet(pet_id, updateData);
    return updatePet;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      throw new AppError(500, error.message || null);
    }
  }
};

// pet 삭제
export const deletePet = async (pet_id: number): Promise<number> => {
  try {
    const pet = await petRepo.findPetById(pet_id);

    if (pet === undefined) throw new Error('[ pet 삭제 에러 ] pet이 존재하지 않습니다.');

    const petId = await petRepo.deletePet(pet_id);
    return petId;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      throw new AppError(500, error.message || null);
    }
  }
};
