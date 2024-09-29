import express, { NextFunction, Request, Response } from 'express';
import router from './router';
import { PORT } from './config';
import { NotFoundError } from './exceptions';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(router);

app.use('/', () => {
  throw new NotFoundError();
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
