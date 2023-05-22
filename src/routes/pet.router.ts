import express from "express";
import * as petController from '../controllers/petController';
import { isAccessTokenValid } from '../middlewares';

export const petRoute = express();


// pet 전체 조회
petRoute.get("/", isAccessTokenValid, petController.getAllPetHandler );

// pet 상세 조회
petRoute.get("/:pet_id",isAccessTokenValid,  petController.getPetHandler );

// pet 등록
petRoute.post("/:user_id", isAccessTokenValid, petController.addPetHandler );

// pet 수정
petRoute.post("/up/:pet_id",isAccessTokenValid,  petController.updatePetHandler );

// pet 삭제
petRoute.delete("/:pet_id",isAccessTokenValid,  petController.deletePetHandler );