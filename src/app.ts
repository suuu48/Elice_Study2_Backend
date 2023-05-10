import express, { Request, Response } from "express";
import { env } from './config/envconfig'
import { db } from './config/dbconfig';

const port = Number(env.PORT)
const app = express();

interface test {
    title: string;
    content: string;
}

const test: test = {
    title: "peeps",
    content: "typescript-server",
};

app.get("/", (req: Request, res: Response) => {
    res.send(test);
});

db.getConnection()
  .then(() => console.log("✅ mysql2 로 DB 접속!"))
  .catch((err) => console.log("error!!!!!!!", err));

app.listen(port, () => {
    console.log('PORT:', env.PORT);
    console.log(`Server is running on port ${port}`);
});
