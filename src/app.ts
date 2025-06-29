import express, { Request, Response, Application } from 'express'
import { expressMiddleware } from '@apollo/server/express4'
import dotenv from 'dotenv'
import cors from 'cors'
import dbConnect from './config/database.connection.js'
import apolloServer from './config/apollo.server.js'
import AppError from './error/app.error.js'
import errorHandler from './middleware/error.middleware.js'
import logger from './utils/logger.js'

dotenv.config();

const app: Application = express()
const PORT = Number(process.env.PORT) || 5000
const MONGO_URL = process.env.MONGO_URL || ''

dbConnect(MONGO_URL)

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.json({ status: 200, message: "App is working" })
})


const startApolloServer = async () => {
    await apolloServer.start();

    app.use('/graphql', express.json(), expressMiddleware(apolloServer));

    app.all('/*', (req: Request, res: Response, next) => {
        next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
    })

    app.use(errorHandler);

    app.listen(PORT, () => logger.info(`server running on PORT ${PORT}`))
}

startApolloServer();
