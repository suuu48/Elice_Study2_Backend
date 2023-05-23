import express from 'express';
import { env } from './config/envconfig';
import { db } from './config/dbconfig';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandlerMiddleware } from './utils/errorHandler';
import { v1Router } from './routes';

const port = Number(env.PORT || 3000);
const app = express();
const allowedOrigins = [
  'http://localhost:5500',
  'http://localhost:5501',
  'http://localhost:5502',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // 쿠키 허용하기 위한 설정임
};

db.getConnection()
  .then(async () => {
    console.log('✅ mysql2 로 DB 접속!');

    /*
    dummyData 초기화가 꼭! 필요할때만 사용해야함
    await insertDummyReviews();
    await insertDummyPosts();
    await insertDummyComments();
    await insertDummyPets();
    */

    app.listen(port, () => {
      console.log('DB_HOST:', env.DB_HOST);
      console.log('DB_NAME:', env.DB_DBNAME);
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.log('error!!!!!!!', err));

app.use(cors(corsOptions)); // 허용 로컬ip

app.use(express.json()); // json 파싱
app.use(express.urlencoded({ extended: true })); // 폼데이터 파싱
app.use(cookieParser()); // 쿠키 파싱

app.use('/api/v1', v1Router);
app.use(errorHandlerMiddleware);
