import { Request, Response, NextFunction } from 'express';

const catchAsync = (passedFunction: any) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(passedFunction(req, res, next)).catch(next);
}

export default catchAsync;