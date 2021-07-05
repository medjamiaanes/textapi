import { createLogger, format, transports } from 'winston'

class LoggerService {
  logger = undefined

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.json(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.prettyPrint({ colorize: true }),
      ),
      transports: [new transports.Console()],
    })
  }

  serverError = (error) => {
    this.logger.error('[Server Error]', {
      tags: 'server error, code 500',
      error,
    })
  }

  customLogger = (level, message) => this.logger.log(level, message)
}

export default new LoggerService()
