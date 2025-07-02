import logger from "../utils/logger.js";
/**
 * Global error handling middleware.
 */
const errorHandler = (err, _req, res, _next) => {
    logger.error(err);
    err.statusCode = err.statusCode ?? 500;
    err.status = err.status ?? "error";
    err.message = err.message ?? "Internal Server Error";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
export default errorHandler;
