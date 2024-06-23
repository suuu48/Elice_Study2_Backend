import { Router } from 'express';
import { Request, Response } from 'express';

const rootRouter = Router();

rootRouter.get('/', (req: Request, res: Response) => {
  res.send('This is "Peeps" root page');
});

export default rootRouter;
