import express, { Request, Response } from 'express';
import { env } from './config/envconfig';
import { db } from './config/dbconfig';
import {
  // insertDummyUsers,
  insertDummyReviews,
  insertDummyPosts,
  insertDummyPets,
  insertDummyComments,
} from './database/dummyDatas';

const port = Number(env.PORT);
const app = express();

interface test {
  title: string;
  content: string;
}

const test: test = {
  title: 'peeps',
  content: 'typescript-server',
};

app.get('/', (req: Request, res: Response) => {
  res.send(test);
});

db.getConnection()
  .then(async () => {
    console.log('✅ mysql2 로 DB 접속!');

    /*
    DB dummyData 초기화가 꼭! 필요할때만 사용해야함
    await insertDummyReviews();
    await insertDummyPosts();
    await insertDummyComments();
    await insertDummyPets();
    */

    app.listen(port, () => {
      console.log('PORT:', env.PORT);
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.log('error!!!!!!!', err));

// async function dummy() {
//   const dummy = await db.query('SELECT * FROM comment');
//   console.log(dummy[0]);
// }
// dummy();
