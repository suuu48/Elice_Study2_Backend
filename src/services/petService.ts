import { Pet } from '../database/models/pet.entity';
import { createPetInput, updatePetInput } from '../database/models';
import * as petRepo from '../database/daos/pet.repo';
import { AppError } from '../utils/errorHandler';
import fs from 'fs';

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
export const updatePet = async (pet_id: number, updateData: updatePetInput): Promise<Pet> => {
  try {
    const pet = await petRepo.findPetById(pet_id);

    if (pet === undefined) throw new Error('[ pet 수정 에러 ] pet이 존재하지 않습니다.');

    await editImage(pet_id, updateData);

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

    await removeImage(pet_id);

    const petId = await petRepo.deletePet(pet_id);
    return petId;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      throw new AppError(500, error.message || null);
    }
  }
};

/* pet 이미지 로컬 수정 */
const editImage = async (pet_id: number, updateData: updatePetInput) => {
  if (updateData.pet_img === undefined) return; // 수정할 이미지가 없는 경우 로컬 삭제 안함

  const pet = await petRepo.findPetById(pet_id);

  const foundPetImage = (pet as { pet_img: string }).pet_img;

  if (foundPetImage === null) return; // 이미지가 원래 없는 pet일 경우 로컬 삭제 안함

  // 이미지가 있는 pet일 경우
  if (foundPetImage) {
    if (foundPetImage === updateData.pet_img) return; // 수정할 이미지가 동일한 경우 로컬 삭제 안함
    else if (foundPetImage !== updateData.pet_img) {
      // 수정할 이미지가 기존과 다른 경우 로컬 삭제
      const imgFileName = foundPetImage.split('/')[6];

      const filePath = `/Users/지원/Desktop/peepsProject/peeps_back-end/public/${imgFileName}`;
      // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
      // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

      fs.unlink(filePath, (error) => {
        if (error) throw new AppError(400, 'pet 이미지 수정 중 오류가 발생했습니다.');
      });
    }
  } else return; // 그 외의 경우 로컬 삭제 안함

  // if (pet.pet_img && pet.pet_img !== updateData.pet_img) {
  //   const imgFileName = pet.pet_img.split('/')[6];

  //   const filePath = `/Users/subin/IdeaProjects/peeps_back-end3/public/${imgFileName}`;
  //   // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
  //   // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

  //   fs.unlink(filePath, (error) => {
  //     if (error) throw new AppError(400, '게시글 이미지 수정 중 오류가 발생했습니다.');
  //   });
  // } else return;
};

/* pet 이미지 로컬 삭제 */
const removeImage = async (pet_id: number) => {
  const pet = await petRepo.findPetById(pet_id);

  const foundPetImage = (pet as { pet_img: string }).pet_img;

  if (foundPetImage === null) return; // 이미지가 원래 없는 pet일 경우 로컬 삭제 안함

  if (pet.pet_img) {
    const imgFileName = pet.pet_img.split('/')[6];

    const filePath = `/Users/지원/Desktop/peepsProject/peeps_back-end/public/${imgFileName}`;
    // const filePath = `/Users/subin/IdeaProjects/peeps_back-end3/public/${imgFileName}`;
    // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
    // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

    fs.unlink(filePath, (error) => {
      if (error) throw new AppError(400, 'pet 이미지 삭제 중 오류가 발생했습니다.');
    });
  } else return;
};
