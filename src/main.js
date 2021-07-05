import express from 'express'
import cors from 'cors'
import http from 'http'
import config from './config'
import dbService from './services/db.service'
import loggerService from './services/logger.service'

const app = express()
const server = new http.Server(app)

dbService.connectDB()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

server.listen(config.serverPort, () => {
  loggerService.customLogger(
    'info',
    `Server up and running in ${process.env.NODE_ENV} mode on port ${config.serverPort}`,
  )
})
