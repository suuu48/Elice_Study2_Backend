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
import {
  createPost,
  findAllPost,
  findPostById,
  updatePost,
  softDeletePost,
} from './database/daos/post.repo';

const port = Number(env.PORT || 3000);
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
