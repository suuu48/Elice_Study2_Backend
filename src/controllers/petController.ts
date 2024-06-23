import { Request, Response, NextFunction } from 'express';
import * as petService from '../services/petService';
import { AppError } from '../utils/errorHandler';
import * as Pet from '../database/models';
import { addPet, deletePet, getAllPet, getPet } from '../services/petService';

// 펫 추가
export const addPetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;

    // console.log(req.body.jwtDecoded);
    // if (req.body.jwtDecoded.userId !== user_id) {
    //   throw new Error('[ 요청 에러 ] 본인이 아닙니다.');
    // }

    const { pet_name, pet_gender, pet_species, pet_birth, pet_info } = req.body;

    const { filename } = req.file || {};

    const imgFileRoot =
      filename === undefined ? null : `http://localhost:5500/api/v1/static/${filename}`;

    if (!user_id || !pet_name || !pet_gender || !pet_species || !pet_birth || !pet_info)
      throw new AppError(400, '모든 필드를 입력해야 합니다.');

    const petData: Pet.createPetInput = {
      user_id,
      pet_name,
      pet_gender,
      pet_species,
      pet_birth,
      pet_info,
      pet_img: imgFileRoot,
    };

    const createdPet = await petService.addPet(petData);

    res.status(201).json({ message: '리뷰 등록 성공', data: createdPet });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 펫 등록 실패'));
    }
  }
};

// pet 상세 조회
export const getPetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pet_id = parseInt(req.params.pet_id);

    if (!pet_id) throw new AppError(400, 'pet_id가 필요합니다.');

    const pet = await petService.getPet(pet_id);

    if (req.body.jwtDecoded.userId !== pet.user_id)
      throw new AppError(400, '본인의 펫이 아닙니다.');

    res.status(200).json({ message: 'pet 상세 조회 성공', data: pet });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 펫 정보 조회 실패'));
    }
  }
};

// 유저 Pet 목록 조회
export const getAllPetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // if (req.body.jwtDecoded.userId !== req.params.user_id) {
    //   throw new Error('[ 요청 에러 ] 본인의 펫만 조회 가능합니다.');
    // }
    const { user_id } = req.params;

    if (!user_id) throw new AppError(400, 'user_id가 필요합니다.');

    const pets = await petService.getAllPet(user_id);

    res.status(200).json({ message: '유저 펫 목록 조회 성공', data: pets });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 유저 펫 목록 조회 실패'));
    }
  }
};

// pet 수정 >> Todo: req.body.jwtDecoded 값이 출력이 안되는거 수정하기
// 이거 요청 body 타입이 formData 타입인데, jwtDecoded는 json이라서 jwtDecoded만 출력 안된다고 합니다.
export const updatePetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pet_id = parseInt(req.params.pet_id);

    if (!pet_id) throw new AppError(400, 'pet_id가 필요합니다.');

    const { pet_name, pet_gender, pet_species, pet_birth, pet_info, user_id } = req.body;
    const { filename } = req.file || {};

    const imgFileRoot =
      filename === undefined ? undefined : `http://localhost:5500/api/v1/static/${filename}`;

    if (!user_id || !pet_name || !pet_gender || !pet_species || !pet_birth || !pet_info)
      throw new AppError(400, '변경된 값이 없습니다!');

    const updatePetData: Pet.updatePetInput = {
      pet_name,
      pet_gender,
      pet_species,
      pet_birth,
      pet_info,
      pet_img: imgFileRoot,
      user_id,
    };

    const findPet = await petService.getPet(pet_id);

    if (findPet.user_id !== updatePetData.user_id) throw new AppError(400, '본인의 펫이 아닙니다.');

    const pet = await petService.updatePet(pet_id, updatePetData);

    res.status(200).json({ message: '펫 정보 수정 성공', data: pet });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 펫 정보 수정 실패'));
    }
  }
};

// pet 삭제
export const deletePetHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pet_id = parseInt(req.params.pet_id);

    if (!pet_id) throw new AppError(400, 'pet_id가 필요합니다.');

    const pet = await petService.getPet(pet_id);

    if (req.body.jwtDecoded.userId !== pet.user_id)
      throw new AppError(400, '본인의 펫이 아닙니다.');

    const petId = await petService.deletePet(pet_id);

    res.status(200).json({ message: '펫 삭제 성공', data: petId });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 펫 삭제 실패'));
    }
  }
};
