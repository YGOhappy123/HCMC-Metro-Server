import { HttpException } from '@/errors/HttpException'
import allowedOrigins from '@/configs/allowedOrigins'
import errorMessage from '@/configs/errorMessage'

const corsOptions = {
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new HttpException(403, errorMessage.BLOCKED_BY_CORS_POLICY))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions
