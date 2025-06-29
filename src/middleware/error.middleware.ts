import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger.js';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    logger.error(err);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.message = err.message || 'Internal Server Error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
}

export default errorHandler;