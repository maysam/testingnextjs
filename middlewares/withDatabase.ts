import { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, Db } from 'mongodb'

import mongoose from 'mongoose'

const databaseUrl = process.env.MONGODB_URI || ''

mongoose.Promise = Promise
mongoose.connect(databaseUrl)

const client = new MongoClient(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
export type Handler = (req: NextApiRequest & { db: Db }, res: NextApiResponse) => number
const withDatabase = (handler: Handler) => (req: NextApiRequest & { db: Db }, res: NextApiResponse) => {
  if (!client.isConnected()) {
    return client.connect().then(() => {
      req.db = client.db() as Db
      return handler(req, res)
    })
  }
  req.db = client.db()
  return handler(req, res)
}
export default withDatabase
