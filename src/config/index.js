import dotenv from 'dotenv'

dotenv.config()

export default {
  serverPort: process.env.PORT || 3300,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbCluster: process.env.DB_CLUSTER,
  dbName: process.env.DB_NAME,
}
