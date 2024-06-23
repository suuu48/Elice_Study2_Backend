import express from 'express';
import * as petController from '../controllers/petController';
import { isAccessTokenValid } from '../middlewares';
import processImage from '../middlewares/multer';

export const petRoute = express();

// 내가 가진 pet 전체 조회
petRoute.get('/me/:user_id', isAccessTokenValid, petController.getAllPetHandler);

// pet 상세 조회
petRoute.get('/:pet_id', isAccessTokenValid, petController.getPetHandler);

// pet 등록
petRoute.post('/:user_id', isAccessTokenValid, processImage, petController.addPetHandler);

// pet 수정
petRoute.patch('/:pet_id', isAccessTokenValid, processImage, petController.updatePetHandler);

// pet 삭제
petRoute.delete('/:pet_id', isAccessTokenValid, petController.deletePetHandler);
