import { dataSource, db } from '../../config/dbconfig';

// userId, reveiwId 입력시 리뷰 전체 조회
export const findOne = async (userId: string, reviewId: string) => {
  const getColumns = '';
  const [review] = await db.query(
    `
    SELECT ${getColumns}
    FROM review
    WHERE user_id = ? and review_id = ?`,
    [userId, reviewId]
  );
  return review;
};

// userId 입력시 리뷰 전체 조회
export const findAll = async (userId: string) => {
  const getColumns = '';
  const [reviews] = await db.query(
    `
    SELECT ${getColumns}
    FROM review
    WHERE user_id = ?`,
    [userId]
  );
  return reviews;
};

