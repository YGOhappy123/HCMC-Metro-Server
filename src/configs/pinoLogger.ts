import pino from 'pino'

const isDevelopment = process.env.NODE_ENV === 'development'

const pinoLogger = pino({
    level: isDevelopment ? 'debug' : 'info',
    transport: isDevelopment
        ? {
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  colorizeObjects: true,
                  singleLine: true,
                  ignore: 'pid,hostname',
                  translateTime: 'SYS:HH:MM:ss'
              }
          }
        : undefined
})

export default pinoLogger
