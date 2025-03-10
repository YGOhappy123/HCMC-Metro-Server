import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import sequelizeIns from '@/configs/connectDB'
import authRoutes from '@/routes/authRoutes'
import errorHandler from '@/middlewares/errorHandler'
import requestLogger from '@/middlewares/requestLogger'
import corsOptions from '@/configs/corsOptions'
import pinoLogger from '@/configs/pinoLogger'

// App and dependencies initialization
const app = express()

// Middlewares configuration
if (process.env.NODE_ENV === 'development') {
    app.use(requestLogger)
}
app.use(cors(corsOptions))
app.use(express.json())

// Route handlers
const API_PATH_BASE = '/api/v1'
const baseRouter = express.Router()

baseRouter.use('/auth', authRoutes)
app.use(API_PATH_BASE, baseRouter)
app.use(errorHandler)

// Database connection and server initialization
const startServer = async () => {
    try {
        await sequelizeIns.authenticate()
        pinoLogger.info('[DATABASE] Connected to MySQL database')

        const PORT = Number(process.env.PORT) || 5000
        const HOST = '0.0.0.0'
        app.listen(PORT, HOST, () => {
            pinoLogger.info(`[SERVER] Server running on port: ${PORT}`)
        })
    } catch (error) {
        pinoLogger.error('[ERROR] Cannot connect to database')
        process.exit(1)
    }
}

startServer()
