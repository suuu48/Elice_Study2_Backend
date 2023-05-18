import { Review } from '../database/models/review.entity';
import { createReviewInput, updateReviewInput } from '../database/models';
import * as reviewRepo from '../database/daos/review.repo';

// 리뷰 등록
export const addReview = async (inputData: createReviewInput) => {
  try {
    const createdReview = await reviewRepo.createReview(inputData);

    const newReview = await reviewRepo.findReviewById(createdReview.review_id);
    if (!newReview) throw new Error('[ 게시글 등록 에러 ] 등록된 게시글이 없습니다.');

    return newReview;
  } catch (error: any) {
    //if (error instanceof AppError) throw error;
    // else {
    console.log(error);
    // throw new AppError(500, error.message || null);
    // }
  }
};

// review_id 특정 리뷰 조회
export const getReview = async (review_id: number): Promise<Review> => {
  try {
    const review = await reviewRepo.findReviewById(review_id);

    if (review === undefined) throw new Error('[ 리뷰 조회 에러 ] 리뷰가 존재하지 않습니다.');

    return review;
  } catch (error: any) {
    console.log(error);
    throw new Error('리뷰 조회에 실패했습니다.'); // Todo: if..else 문으로 변경하기
    // if (error instanceof AppError) throw error;
    // else throw new AppError(404, error.message);
  }
};

// location_id에 따른 전체 리뷰 조회
export const getALlReview = async (location_id: string): Promise<Review[]> => {
  try {
    const reviews = await reviewRepo.findReviewByLocation(location_id);

    if (reviews === undefined) throw new Error('[ 리뷰 조회 에러 ] 리뷰가 존재하지 않습니다.');

    return reviews;
  } catch (error: any) {
    console.log(error);
    throw new Error('리뷰 조회에 실패했습니다.'); // Todo: if..else 문으로 변경하기
    // if (error instanceof AppError) throw error;
    // else throw new AppError(404, error.message);
  }
};

// 리뷰 수정
export const updateReview = async (
  review_id: number,
  updateData: updateReviewInput
): Promise<Review> => {
  try {
    const review = await reviewRepo.findReviewById(review_id);

    if (review === undefined) throw new Error('[ 리뷰 수정 에러 ] 리뷰가 존재하지 않습니다.');

    const updateReview = await reviewRepo.updateReview(review_id, updateData);
    return updateReview;
  } catch (error: any) {
    console.log(error);
    throw new Error('[리뷰 수정 에러] 리뷰 수정에 실패했습니다.'); // Todo: if..else 문으로 변경하기
    // if (error instanceof AppError) throw error;
    // else throw new AppError(404, error.message);
  }
};

// 리뷰 삭제
export const deleteReview = async (review_id: number): Promise<Review> => {
  try {
    const review = await reviewRepo.findReviewById(review_id);

    if (review === undefined) throw new Error('[ 리뷰 삭제 에러 ] 리뷰가 존재하지 않습니다.');

    const deleteReview = await reviewRepo.deleteReview(review_id);
    return deleteReview;
  } catch (error: any) {
    console.log(error);
    throw new Error('리뷰 삭제에 실패했습니다.'); // Todo: if..else 문으로 변경하기
    // if (error instanceof AppError) throw error;
    // else throw new AppError(404, error.message);
  }
};
