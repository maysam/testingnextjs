import { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, Db } from 'mongodb'
import mongoose from 'mongoose'

export type Handler = (req: NextApiRequest & { db: Db; dbClient: MongoClient }, res: NextApiResponse) => Promise<number>

const databaseUrl = process.env.NEXT_PUBLIC_MONGODB_URI || ''

const client = new MongoClient(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })

const withDatabase = (handler: Handler) => async (
  req: NextApiRequest & { db: Db; dbClient: MongoClient },
  res: NextApiResponse
) => {
  mongoose.Promise = Promise
  await mongoose.connect(databaseUrl, { useCreateIndex: true })
  mongoose.set('useCreateIndex', true)

  if (!client.isConnected()) {
    await client.connect()
  }

  req.dbClient = client
  req.db = client.db() as Db
  return handler(req, res)
}
export default withDatabase
