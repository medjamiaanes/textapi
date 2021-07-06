import express from 'express'
import cors from 'cors'
import http from 'http'
import dbService from './services/db.service'
import textRouter from './api/routes/text.router'

const app = express()
const server = new http.Server(app)

dbService.connectDB()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/text', textRouter)

export default server
