import mongoose from 'mongoose'
import config from '../config'

class DatabaseService {
  dbUser = undefined

  dbName = undefined

  dbCluster = undefined

  dbPassword = undefined

  constructor() {
    this.dbUser = config.dbUser
    this.dbPassword = config.dbPassword
    this.dbCluster = config.dbCluster
    this.dbName = config.dbName
  }

  connectDB = () => {
    console.log(`Connecting to database ....`)
    const connection = mongoose.createConnection(
      `mongodb+srv://${this.dbUser}:${this.dbPassword}@${this.dbCluster}.iqubh.mongodb.net/${this.dbName}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )

    connection.once('open', () =>
      console.log('Connection to DB established successfully'),
    )
    connection.on('error', (err) =>
      console.log('DB connection error', { err }),
    )

    return connection
  }
}

export default new DatabaseService()
