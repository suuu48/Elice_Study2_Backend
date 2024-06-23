import { env } from './envconfig';
import { DataSource } from 'typeorm';
import mysql from 'mysql2/promise';
// 보통은 DataSource를 사용하고, 추가적인 기능이 필요할 때 mysql2 모듈을 함께 사용

// mysql2 Connect
// mysql2를 사용하면 MySQL 데이터베이스에서 직접 쿼리를 실행 => TypeORM에서 제공하지 않는 특정 기능을 사용해야 할 때 유용
export const db = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DBNAME,
  port: 3306,
});

// typeorm Connect
// typeorm를 사용하면 SQL 쿼리를 직접 작성하지 않아도 됨, 제공해주는 함수들로 데이터를 가져옴
export const dataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DBNAME,
  port: 3306,
  entities: ['src/database/models/*.entity.ts'],
  logging: false,
  synchronize: true,
});

// query 오류처리
// db.query에서 추가적인 오류 처리가 필요하다면, executeQuery 함수를 사용하는 것이 좋음 (그냥 남겨두겠습니다.)
/*
export async function executeQuery(query: string, params: any[]): Promise<any> {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    console.log('쿼리 실행 에러: ', error);
    throw error;
  } finally {
    connection.release();
  }
}
*/
