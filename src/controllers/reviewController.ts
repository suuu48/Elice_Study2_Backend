import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/reviewService';
import { AppError } from '../utils/errorHandler';
import * as Review from '../database/models';
import { getReview, isVaildReview } from '../services/reviewService';

// 리뷰 등록
export const addReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;
    const { location_id, review_content, star_rating } = req.body;
    const { filename } = req.file || {};

    const imgFileRoot =
      filename === undefined ? null : `http://localhost:5500/api/v1/static/${filename}`;

    if (!user_id || !location_id || !review_content || !star_rating)
      throw new AppError(400, '모든 필드를 입력해야 합니다.');

    const reviewData: Review.createReviewInput = {
      location_id,
      user_id,
      review_content,
      star_rating,
      review_img: imgFileRoot,
    };

    const createdReview = await reviewService.addReview(reviewData);

    res.status(201).json({ message: '리뷰 등록 성공', data: createdReview });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 리뷰 등록 실패'));
    }
  }
};

// 리뷰 상세 조회
export const getReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review_id = parseInt(req.params.review_id);

    if (!review_id) throw new AppError(400, 'review_id가 필요합니다.');

    const review = await reviewService.getReview(review_id);

    res.status(200).json({ message: '리뷰 상세 조회 성공', data: review });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 리뷰 상세 조회 실패'));
    }
  }
};

// 장소별 리뷰전체 조회
export const getAllReviewsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location_id } = req.params;

    const reviews = await reviewService.getAllReview(location_id);

    res.status(200).json({ message: '장소에 따른 전체 리뷰 조회 성공', data: reviews });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 리뷰 전체 조회 실패'));
    }
  }
};

// 리뷰 수정
export const updateReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review_id = parseInt(req.params.review_id);
    const { review_content, star_rating } = req.body;
    const { filename } = req.file || {};

    if (!review_id) throw new AppError(400, 'review_id가 필요합니다.');

    const imgFileRoot =
      filename === undefined ? undefined : `http://localhost:5500/api/v1/static/${filename}`;

    if (!review_content && !star_rating) throw new AppError(400, '변경된 값이 없습니다!');

    const updateReviewData: Review.updateReviewInput = {
      review_content,
      star_rating,
      review_img: imgFileRoot,
    };

    const updateReview = await reviewService.updateReview(review_id, updateReviewData);

    res.status(200).json({ message: '리뷰 수정 성공', data: updateReview });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 리뷰 수정 실패'));
    }
  }
};

// 리뷰 삭제
export const deleteReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review_id = parseInt(req.params.review_id);

    if (!review_id) throw new AppError(400, 'review_id가 필요합니다.');

    const review = await reviewService.getReview(review_id);

    if (req.body.jwtDecoded.userId !== review.user_id)
      throw new AppError(400, '본인이 작성한 리뷰가 아닙니다.');

    const reviewId = await reviewService.deleteReview(review_id);

    res.status(200).json({ message: '리뷰 삭제 성공', data: reviewId });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 리뷰 삭제 실패'));
    }
  }
};
