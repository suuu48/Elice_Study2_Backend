import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/reviewService';
import { AppError } from '../utils/errorHandler';
import * as Review from '../database/models';
import { getReview, isVaildReview } from '../services/reviewService';

// 리뷰 추가
export const addReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;
    const { location_id, review_content, star_rating } = req.body;
    const { filename } = req.file || {};

    const imgFileRoot =
      filename === undefined ? null : `http://localhost:5500/api/v1/static/${filename}`;

    if (!user_id || !location_id || !review_content || !star_rating)
      throw new Error('[ 요청 에러 ] 모든 필드를 입력해야 합니다.');

    const reviewData: Review.createReviewInput = {
      location_id,
      user_id,
      review_content,
      star_rating,
      review_img: imgFileRoot,
    };

    const createdReview = await reviewService.addReview(reviewData);
    res.status(201).json({ message: '리뷰 등록 성공', data: createdReview });
  } catch (error: any) {
    if (error instanceof AppError) next(error);
    else {
      console.log(error);
      next(new AppError(500, error.message));
    }
  }
};

// 리뷰 상세 조회
export const getReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review_id = parseInt(req.params.review_id);
    if (!review_id) throw new Error('[ 요청 에러 ] review_id가 필요합니다.');

    const review = await reviewService.getReview(review_id);

    res.status(200).json({ message: '리뷰 상세 조회 성공', data: review });
  } catch (error: any) {
    console.log(error);
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message));
  }
};

// 장소별 리뷰전체 조회
export const getAllReviewsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location_id } = req.params;
    const reviews = await reviewService.getALlReview(location_id);

    res.status(200).json({ message: '장소에 따른 전체 리뷰 조회 성공', data: reviews });
  } catch (error: any) {
    console.log(error);
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message || null));
  }
};

// 리뷰 수정
export const updateReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review_id = parseInt(req.params.review_id);
    if (!review_id) throw new Error('[ 요청 에러 ] review_id가 필요합니다.');

    const { review_content, star_rating, review_img } = req.body;
    console.log(req.file);
    const { filename } = req.file || {};

    const imgFileRoot =
      filename === undefined ? undefined : `http://localhost:5500/api/v1/static/${filename}`;

    if (!review_content && !star_rating && !review_img)
      throw new Error('[ 요청 에러 ] 변경된 값이 없습니다!');

    const updateReviewData: Review.updateReviewInput = {
      review_content,
      star_rating,
      review_img: imgFileRoot,
    };

    const updateReview = await reviewService.updateReview(review_id, updateReviewData);

    res.status(200).json({ message: '리뷰 수정 성공', data: updateReview });
  } catch (error: any) {
    console.log(error);
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message));
  }
};

// 리뷰 삭제
export const deleteReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review_id = parseInt(req.params.review_id);
    if (!review_id) throw new Error('[ 요청 에러 ] review_id가 필요합니다.');
    const review = await reviewService.getReview(review_id);

    if (req.body.jwtDecoded.userId !== review.user_id) {
      throw new Error('[ 리뷰 삭제 에러 ] 본인이 작성한 리뷰가 아닙니다.');
    }

    const reviewId = await reviewService.deleteReview(review_id);
    res.status(200).json({ message: '리뷰 삭제 성공', data: reviewId });
  } catch (error: any) {
    console.log(error);
    if (error instanceof AppError) next(error);
    else next(new AppError(500, error.message));
  }
};
