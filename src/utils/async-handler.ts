import { NextFunction, Request, Response } from 'express';

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(next)
};

export default asyncHandler;
