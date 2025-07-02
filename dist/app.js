import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import dbConnect from "./config/database.connection.js";
import apolloServer from "./config/apollo.server.js";
import AppError from "./error/app.error.js";
import errorHandler from "./middleware/error.middleware.js";
import logger from "./utils/logger.js";
import transactionRoute from './route/transaction.route.js';
dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URL = process.env.MONGO_URL;
const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? "http://localhost:3001").split(",");
if (!MONGO_URL) {
    logger.error("MONGO_URL is not defined. Exiting...");
    process.exit(1);
}
(async () => {
    try {
        await dbConnect(MONGO_URL);
    }
    catch (error) {
        logger.error("Failed to connect to MongoDB, Exiting...");
        process.exit(1);
    }
})();
// standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: CORS_ORIGINS,
    credentials: true,
}));
app.get("/", (req, res) => {
    res.json({ status: 200, message: "App is working" });
});
app.use('/api/transactions', transactionRoute);
//start apolloServer once evrything is set up
async function startApolloServer() {
    await apolloServer.start();
    app.use("/graphql", expressMiddleware(apolloServer));
    //404 handler for all unhandled routes
    app.all("/*", (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });
    app.use(errorHandler);
}
//Invoke startApolloServer
(async () => {
    try {
        await startApolloServer();
    }
    catch (error) {
        logger.error("Failed to start Apollo Server", error);
        process.exit(1);
    }
})();
//start HTTP server
const server = app.listen(PORT, () => logger.info(`server running on PORT ${PORT}`));
//graceful shutdown on SIGINT/SIGTERM
async function shutdown() {
    logger.info("Shutdown signal received. Closing server and DB...");
    server.close(async (err) => {
        if (err) {
            logger.error("Error shutting down HTTP server:", err);
            //exiting with failure code
            process.exit(1);
        }
        try {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed.");
            process.exit(0); //success
        }
        catch (error) {
            logger.error("Error closing MOngoDB connection:", error);
            process.exit(1); //error
        }
    });
}
process.on("SIGINT", shutdown); //Ctrl+c
process.on("SIGTERM", shutdown); //docker stop
