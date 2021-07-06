import server from './src/server'
import loggerService from './src/services/logger.service'
import config from './src/config'

server.listen(config.serverPort, () => {
  loggerService.customLogger(
    'info',
    `Server up and running in ${process.env.NODE_ENV} mode on port ${config.serverPort}`,
  )
})
