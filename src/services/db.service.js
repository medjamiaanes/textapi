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

  connectDB = async () => {
    try {
      console.log(`Connecting to database ....`)
      const mongo = await mongoose.connect(
        `mongodb+srv://${this.dbUser}:${this.dbPassword}@${this.dbCluster}.iqubh.mongodb.net/${this.dbName}?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        },
      )
      console.log('Connection to DB established successfully')

      return mongo.connection
    } catch (error) {
      console.log('DB connection error', { error })
      return error
    }
  }
}

export default new DatabaseService()
