import dotenv from 'dotenv'
dotenv.config()

import sequelizeIns from '@/configs/connectDB'
import pinoLogger from '@/configs/pinoLogger'

const synchronizeDatabase = async () => {
    try {
        await sequelizeIns.authenticate()
        await sequelizeIns.sync({ alter: true })
        pinoLogger.info('[DATABASE] Synchronized changes to MySQL database')
    } catch (error) {
        pinoLogger.error('[ERROR] Cannot connect to database')
    } finally {
        process.exit(1)
    }
}

synchronizeDatabase()
