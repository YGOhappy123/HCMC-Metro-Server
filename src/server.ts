import express from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()

import sequelizeIns from '@/configs/connectDB'
import corsOptions from '@/configs/corsOptions'
import pinoLogger from '@/configs/pinoLogger'
import errorHandler from '@/middlewares/errorHandler'
import requestLogger from '@/middlewares/requestLogger'
import authRoutes from '@/routes/authRoutes'
import customerRoutes from '@/routes/customerRoutes'
import personnelRoutes from '@/routes/personnelRoutes'
import fileRoutes from '@/routes/fileRoutes'
import stationRoutes from '@/routes/stationRoutes'
import issuedTicketRoutes from '@/routes/issuedTicketRoutes'
import ticketRoutes from '@/routes/ticketRoutes'
import priceRoutes from '@/routes/priceRoutes'

// App and dependencies initialization
const app = express()
const memoryStorage = multer.memoryStorage()
const upload = multer({ storage: memoryStorage })

// Middlewares configuration
if (process.env.NODE_ENV === 'development') {
    app.use(requestLogger)
}
app.use(upload.array('file'))
app.use(cors(corsOptions))
app.use(express.json())

// Route handlers
const API_PATH_BASE = '/api/v1'
const baseRouter = express.Router()

baseRouter.use('/auth', authRoutes)
baseRouter.use('/files', fileRoutes)
baseRouter.use('/stations', stationRoutes)
baseRouter.use('/prices', priceRoutes)
baseRouter.use('/customers', customerRoutes)
baseRouter.use('/personnel', personnelRoutes)
baseRouter.use('/issued-tickets', issuedTicketRoutes)
baseRouter.use('/tickets', ticketRoutes)
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
