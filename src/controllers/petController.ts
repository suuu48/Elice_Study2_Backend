import { Request, Response, NextFunction } from 'express';
import * as petService from '../services/pet.service';
import { AppError } from '../utils/errorHandler';
import * as Pet from '../database/models';
import { addPet, deletePet, getALlPet, getPet } from '../services/pet.service';

// 펫 추가
export const addPetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { pet_name, pet_gender, pet_species, pet_birth, pet_info, pet_img } = req.body;

    if (
      !user_id ||
      !pet_name ||
      !pet_gender ||
      !pet_species ||
      !pet_birth ||
      !pet_info ||
      !pet_img
    )
      throw new Error('[ 요청 에러 ] 모든 필드를 입력해야 합니다.');

    const petData: Pet.createPetInput = {
      user_id,
      pet_name,
      pet_gender,
      pet_species,
      pet_birth,
      pet_info,
      pet_img,
    };

    const createdPet = await petService.addPet(petData);
    res.status(201).json({ message: '리뷰 등록 성공', data: createdPet });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else {
      console.log(error);
      next(new AppError(500, error.message));
    }
  }
};

// pet 상세 조회
export const getPetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pet_id = parseInt(req.params.petId);
    if (!pet_id) throw new Error('[ 요청 에러 ] pet_id가 필요합니다.');

    const pet = await petService.getPet(pet_id);

    res.status(200).json({ message: 'pet 상세 조회 성공', data: pet });
  } catch (error: any) {
    console.log(error);
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message));
  }
};

// pet 전체 조회
export const getAllPetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const {user_id}  = req.body;
    const pets = await petService.getALlPet(user_id);

    res.status(200).json({ message: '전체 pets 조회 성공', data: pets });
  } catch (error: any) {
    console.log(error);
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message || null));
  }
};

// pet 수정
export const updatePetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pet_id = parseInt(req.params.pet_id);
    const {user_id}  = req.body;
    if (!pet_id) throw new Error('[ 요청 에러 ] pet_id가 필요합니다.');

    const { pet_name, pet_gender, pet_species, pet_birth, pet_info, pet_img } = req.body;

    if ( !user_id ||!pet_name || !pet_gender || !pet_species || !pet_birth || !pet_info || !pet_img )
      throw new Error('[ 요청 에러 ] 변경된 값이 없습니다!');

    const updatePetData: Pet.updatePetInput = {
      pet_name,
      pet_gender,
      pet_species,
      pet_birth,
      pet_info,
      pet_img,
      user_id,
    };
    const pet = await petService.updatePet(pet_id, updatePetData);

    res.status(200).json({ message: 'pet 수정 성공', data: pet });
  } catch (error: any) {
    console.log(error);
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message));
  }
};

// pet 삭제
export const deletePetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pet_id = parseInt(req.params.pet_id);
    if (!pet_id) throw new Error('[ 요청 에러 ] pet_id가 필요합니다.');

    const petId = await petService.deletePet(pet_id);

    res.status(200).json({ message: 'pet 삭제 성공', data: petId });
  } catch (error: any) {
    console.log(error);
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message));
  }
};
