import { dataSource, db } from '../../config/dbconfig';
import { Review, User } from '../models';
import { updateDataTrans } from './user.repo';

//  reviewId 입력시 리뷰 전체 조회
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

// location_id 입력시 리뷰 전체 조회 >> Todo: 리뷰 조회할때 location_id로 검색할건지, location_name으로 검색할건지
export const findReviewByLocation = async (
  locationId: string,
  locationName: string
): Promise<Review> => {
  try {
    const [reviews]: any = await db.query(
      `
      SELECT *
      FROM review
      WHERE location_id = ? And location_name =?`,
      [locationId, locationName]
    );

    return reviews;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 리뷰 추가 >> Todo: satr_rating default값 뭐로 할지
export const createReview = async (
  inputData: Record<string, string | number | boolean>
): Promise<Review> => {
  try {
    const newColumns =
      'location_id, location_name, location_category, user_id, review_content, star_rating';
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
  updateData: Record<string, string | number>
): Promise<Review> => {
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

// 리뷰 정보 소프트 delete
export const softDeleteReview = async (reviewId: number): Promise<Review> => {
  try {
    const [deleteReview] = await db.query(
      `
          Update review
          SET delete_flag ='1'
          WHERE review_id = ?`,
      [reviewId]
    );

    const softDeleteReview = await findReviewById(reviewId);

    return softDeleteReview!;
  } catch (error) {
    console.log(error);
    return Promise.reject(error); // App Error
  }
};
