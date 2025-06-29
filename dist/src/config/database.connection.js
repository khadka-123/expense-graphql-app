import mongoose from 'mongoose';
import logger from '../utils/logger.js';
async function dbConnect(url) {
    try {
        await mongoose.connect(url);
        logger.info("Connection Successful");
    }
    catch (error) {
        logger.error('MongoDB connection failed', error);
        process.exit(1);
    }
}
export default dbConnect;
