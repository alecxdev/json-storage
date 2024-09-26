import express, { NextFunction, Request, Response } from 'express';
import router from './router';
import { PORT } from './config';
import { ServerError } from './exceptions';

const app = express();

app.use(router);

app.use('/', () => {
  throw new ServerError();
});

app.use((err: Error | undefined, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      res.json({ success: false, error: err.message });
    }

    next();
  },
);

app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});
