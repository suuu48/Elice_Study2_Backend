import { DataSource } from 'typeorm';
import mysql from 'mysql2/promise';
// 보통은 DataSource를 사용하고, 추가적인 기능이 필요할 때 mysql2 모듈을 함께 사용

// mysql2 Connect
// mysql2를 사용하면 MySQL 데이터베이스에서 직접 쿼리를 실행 => TypeORM에서 제공하지 않는 특정 기능을 사용해야 할 때 유용
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  port: 3306,
});

// typeorm Connect
// typeorm를 사용하면 SQL 쿼리를 직접 작성하지 않아도 됨, 제공해주는 함수들로 데이터를 가져옴

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  port: 3306,
  entities: ['src/database/models/*.entity.ts'],
  logging: false,
  synchronize: true,
});
