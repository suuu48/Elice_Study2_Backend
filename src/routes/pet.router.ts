import express from "express";
import * as petController from '../controllers/petController';

export const petRoute = express();


// pet 전체 조회
petRoute.get("/:userId", petController.getAllPetHandler );

// pet 상세 조회
petRoute.get("/:petId", petController.getPetHandler );

// pet 등록
petRoute.post("/:userId", petController.addPetHandler );

// pet 수정
petRoute.post("/:petId", petController.updatePetHandler );

// pet 삭제
petRoute.delete("/:petId", petController.deletePetHandler );