import mongoose from "mongoose";
import logger from "../utils/logger.js";
/**
 * Establish a connection to MongoDB using Mongoose
 *
 * Connect to MongoDB using Mongoose.
 *@param url - MongoDB connection string. Must be defined.
 *@param options - Optional Mongoose connection options (type-safe).
 *@returns A Promise that resolves when the connection is successful.
 *@throws Will throw an error if the MongoDB URL is not defined or the connection fails.
 */
async function dbConnect(url, options = {}) {
    if (!url) {
        throw new Error("MongoDB URL is not defined");
    }
    try {
        await mongoose.connect(url, options);
        logger.info("MongoDB connection successful");
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        logger.error(`MongoDB connection failed :${errMsg}`);
        throw error;
    }
}
export default dbConnect;
