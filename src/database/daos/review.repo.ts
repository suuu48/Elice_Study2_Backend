import { dataSource, db } from '../../config/dbconfig';
import { createReviewInput, Review,  updateReviewInput, User } from '../models';
import { updateDataTrans } from './user.repo';

//  reviewId 입력시 리뷰 상세 조회
export const findReviewById = async (reviewId: number): Promise<Review> => {
  try {
    const [review]: any = await db.query(
      `
      SELECT *
      FROM review
      WHERE review_id = ?`,
      [reviewId]
    );

    return review;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// location_id 입력시 리뷰 전체 조회
export const findReviewByLocation = async (
  locationId: string
): Promise<Review[]> => {
  try {
    const [reviews]: any = await db.query(
      `
      SELECT *
      FROM review
      WHERE location_id = ?`,
      [locationId]
    );

    return reviews;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 리뷰 추가
export const createReview = async (
  inputData: createReviewInput): Promise<Review> => {
  try {
    const newColumns =
      'location_id, location_name, user_id, review_content, star_rating, review_img';
    const newValues = Object.values(inputData)
      .map((value) => (typeof value === 'string' ? `'${value}'` : value))
      .join(', ');

    const [newReview] = await db.query(
      `
          INSERT INTO review (${newColumns})
          VALUES (${newValues})
      `
    );

    const createdReviewId = (newReview as { insertId: number }).insertId;
    const createdReview = await findReviewById(createdReviewId);

    return createdReview!; // null일 가능성이 없음을 !로 명시적 선언함
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

// 리뷰 정보 수정
export const updateReview = async (
  reviewId: number,
  updateData: updateReviewInput): Promise<Review> => {
  try {
    const [keys, values] = updateDataTrans(updateData);
    const [update] = await db.query(
      `
          UPDATE review
          SET ${keys.join(', ')}
          WHERE review_id = ?
      `,
      [...values, reviewId]
    );

    const updateReview = await findReviewById(reviewId);
    return updateReview!;
  } catch (error) {
    console.log(error);
    return Promise.reject(error); // App Error
  }
};

// 리뷰 정보 delete
export const deleteReview = async (reviewId: number): Promise<Review> => {
  try {
    const [deleteReview]: any = await db.query(
      `
          DELETE FROM
              review
          WHERE review_id = ? `,
      [reviewId]
    );

    return deleteReview;
  } catch (error) {
    console.log(error);
    return Promise.reject(error); // App Error
  }
};
