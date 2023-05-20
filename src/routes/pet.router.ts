import express from "express";
import * as petController from '../controllers/petController';

export const petRoute = express();


// pet 전체 조회
petRoute.get("/", petController.getAllPetHandler );

// pet 상세 조회
petRoute.get("/:pet_id", petController.getPetHandler );

// pet 등록
petRoute.post("/:user_id", petController.addPetHandler );

// pet 수정
petRoute.post("/up/:pet_id", petController.updatePetHandler );

// pet 삭제
petRoute.delete("/:pet_id", petController.deletePetHandler );