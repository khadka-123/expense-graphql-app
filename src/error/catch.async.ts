import { Request, Response, NextFunction } from "express";

/**
 * Wrap async function to catch errors and pass to next().
 */
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export default catchAsync;
