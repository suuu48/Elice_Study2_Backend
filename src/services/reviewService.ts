import { Review } from '../database/models/review.entity';
import { createReviewInput, updateReviewInput } from '../database/models';
import * as reviewRepo from '../database/daos/review.repo';
import { AppError } from '../utils/errorHandler';
import fs from 'fs';

// 리뷰 등록
export const addReview = async (inputData: createReviewInput): Promise<Review> => {
  try {
    const createdReview = await reviewRepo.createReview(inputData);

    const newReview = await reviewRepo.findReviewById(createdReview.review_id);

    if (!newReview) throw new AppError(404, '등록된 리뷰가 없습니다.');

    return newReview;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 리뷰 등록 실패');
    }
  }
};

// review_id 특정 리뷰 조회
export const getReview = async (review_id: number): Promise<Review> => {
  try {
    const review = await reviewRepo.findReviewById(review_id);

    if (review === undefined) throw new AppError(404, '리뷰가 존재하지 않습니다.');

    return review;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 리뷰 상세 조회 실패');
    }
  }
};

// location_id에 따른 전체 리뷰 조회
export const getAllReview = async (location_id: string): Promise<Review[]> => {
  try {
    const reviews = await reviewRepo.findReviewByLocation(location_id);

    if (reviews === undefined) throw new AppError(404, '리뷰가 존재하지 않습니다.');

    return reviews;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 리뷰 전체 조회 실패');
    }
  }
};

// 리뷰 수정
export const updateReview = async (
  review_id: number,
  updateData: updateReviewInput
): Promise<Review> => {
  try {
    const review = await reviewRepo.findReviewById(review_id);

    if (review === undefined) throw new AppError(404, '리뷰가 존재하지 않습니다.');

    await editImage(review_id, updateData);

    const updateReview = await reviewRepo.updateReview(review_id, updateData);

    return updateReview;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 리뷰 수정 실패');
    }
  }
};

// review_id 특정 리뷰 조회
export const isVaildReview = async (review_id: number): Promise<Review> => {
  try {
    const review = await reviewRepo.findReviewById(review_id);

    if (review === undefined) throw new AppError(404, '본인이 작성한 리뷰가 아닙니다.');

    return review;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 리뷰 상세 조회 실패');
    }
  }
};

// 리뷰 삭제
export const deleteReview = async (review_id: number): Promise<number> => {
  try {
    const review = await reviewRepo.findReviewById(review_id);

    if (review === undefined) throw new AppError(404, '리뷰가 존재하지 않습니다.');

    await removeImage(review_id);

    const reviewId = await reviewRepo.deleteReview(review_id);

    return reviewId;
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 리뷰 삭제 실패');
    }
  }
};

/* 리뷰 이미지 로컬 수정 */
const editImage = async (review_id: number, updateData: updateReviewInput) => {
  if (updateData.review_img === undefined) return; // 수정할 이미지가 없는 경우 로컬 삭제 안함

  const review = await reviewRepo.findReviewById(review_id);

  const foundReviewImage = (review as { review_img: string }).review_img;

  if (foundReviewImage === null) return; // 이미지가 원래 없는 리뷰일 경우 로컬 삭제 안함

  // 이미지가 있는 리뷰일 경우
  if (foundReviewImage) {
    if (foundReviewImage === updateData.review_img)
      return; // 수정할 이미지가 동일한 경우 로컬 삭제 안함
    else if (foundReviewImage !== updateData.review_img) {
      // 수정할 이미지가 기존과 다른 경우 로컬 삭제
      const imgFileName = foundReviewImage.split('/')[6];

      const filePath = `/Users/지원/Desktop/peepsProject/peeps_back-end/public/${imgFileName}`;
      // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
      // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

      fs.unlink(filePath, (error) => {
        if (error) throw new AppError(400, '리뷰 이미지 수정 중 오류가 발생했습니다.');
      });
    }
  } else return; // 그 외의 경우 로컬 삭제 안함

  // if (review.review_img && review.review_img !== updateData.review_img) {
  //   const imgFileName = review.review_img.split('/')[6];

  //   const filePath = `/Users/subin/IdeaProjects/peeps_back-end3/public/${imgFileName}`;
  //   // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
  //   // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

  //   fs.unlink(filePath, (error) => {
  //     if (error) throw new AppError(400, '리뷰 이미지 수정 중 오류가 발생했습니다.');
  //   });
  // } else return;
};

/* 리뷰 이미지 로컬 삭제 */
const removeImage = async (review_id: number) => {
  const review = await reviewRepo.findReviewById(review_id);

  const foundReviewImage = (review as { review_img: string }).review_img;

  if (foundReviewImage === null) return; // 이미지가 원래 없는 리뷰일 경우 로컬 삭제 안함

  if (review.review_img) {
    const imgFileName = review.review_img.split('/')[6];

    const filePath = `/Users/지원/Desktop/peepsProject/peeps_back-end/public/${imgFileName}`;
    // const filePath = `/Users/subin/IdeaProjects/peeps_back-end3/public/${imgFileName}`;
    // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
    // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

    fs.unlink(filePath, (error) => {
      if (error) throw new AppError(400, '리뷰 이미지 삭제 중 오류가 발생했습니다.');
    });
  } else return;
};
