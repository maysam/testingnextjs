import { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, Db } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI || '', { useNewUrlParser: true })
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
