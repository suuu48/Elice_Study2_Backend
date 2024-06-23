import { db } from '../../config/dbconfig';
import { AppError } from '../../utils/errorHandler';
import { createReviewInput, Review, updateReviewInput, User } from '../models';
import { updateDataTrans } from './user.repo';

//  reviewId 입력시 리뷰 상세 조회
export const findReviewById = async (reviewId: number): Promise<Review> => {
  try {
    const [review]: any = await db.query(
      `
      SELECT 
          r.review_id,
          r.location_id,
          r.review_content,
          r.star_rating,
          r.created_at,
          r.review_img,
          r.user_id,
          u.user_nickname,
          u.user_img
      FROM review r 
      JOIN user u
      On r.user_id = u.user_id
      WHERE review_id = ?`,
      [reviewId]
    );

    return review[0];
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 리뷰 상세 조회 실패');
  }
};

// location_id 입력시 리뷰 전체 조회
export const findReviewByLocation = async (locationId: string): Promise<Review[]> => {
  try {
    const [reviews]: any = await db.query(
      `
          SELECT
              r.review_id,
              r.location_id,
              r.review_content,
              r.star_rating,
              r.created_at,
              r.review_img,
              u.user_nickname,
              u.user_img
          FROM review r
            JOIN user u
            On r.user_id = u.user_id
        WHERE location_id = ?`,
      [locationId]
    );

    return reviews;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 리뷰 전체 조회 실패');
  }
};

// 리뷰 등록
export const createReview = async (inputData: createReviewInput): Promise<Review> => {
  try {
    const newColumns = 'location_id, user_id, review_content, star_rating, review_img';

    const newValues = Object.values(inputData)
      .map((value) => {
        if (value === null) return 'DEFAULT';
        else if (typeof value === 'string') return `'${value}'`;
        else return value;
      })
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
    throw new AppError(500, '[ DB 에러 ] 리뷰 등록 실패');
  }
};

// 리뷰 정보 수정
export const updateReview = async (
  reviewId: number,
  updateData: updateReviewInput
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
    throw new AppError(500, '[ DB 에러 ] 리뷰 수정 실패');
  }
};

// 리뷰 정보 delete
export const deleteReview = async (reviewId: number): Promise<number> => {
  try {
    const [deleteReview]: any = await db.query(
      `
          DELETE FROM
              review
          WHERE review_id = ? `,
      [reviewId]
    );

    return reviewId;
  } catch (error) {
    console.log(error);
    throw new AppError(500, '[ DB 에러 ] 리뷰 삭제 실패');
  }
};
