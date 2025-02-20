import express from 'express'
import dotenv from 'dotenv'
import dbConnection from '@/configs/connectDB'
import authRoutes from '@/routes/authRoutes'

// App and dependencies initialization
dotenv.config()
const app = express()

// Middlewares configuration
app.use(express.json())

// Route handlers
const API_PREFIX = '/api/v1'
const baseRouter = express.Router()

baseRouter.use('/auth', authRoutes)
app.use(API_PREFIX, baseRouter)

// DB connection and server initialization
const startServer = async () => {
    try {
        await dbConnection.authenticate()
        console.log('✅ Connected to MySQL database')

        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port: ${PORT}`)
        })
    } catch (error) {
        console.error('❌ DB Connection Error:', error)
        process.exit(1)
    }
}

startServer()
