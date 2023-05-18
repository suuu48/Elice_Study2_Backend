import express from 'express';
import * as reviewController from '../controllers/reviewController';

export const reviewRoute = express();

// 리뷰 등록
reviewRoute.post('/', reviewController.addReviewHandler);

// 리뷰 상세 조회
reviewRoute.get('/:review_id', reviewController.getReviewHandler);

// 장소별 리뷰 전체 조회
reviewRoute.get('/', reviewController.getAllReviewsHandler);

// 리뷰 수정
reviewRoute.post('/:review_id', reviewController.updateReviewHandler);

// 리뷰 삭제
reviewRoute.delete('/:review_id', reviewController.deleteReviewHandler);
