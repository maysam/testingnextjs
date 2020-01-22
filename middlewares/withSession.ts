import session from 'next-session'
import connectMongo from 'connect-mongo'
import { Handler } from './withDatabase'

const MongoStore = connectMongo(session)

const withSession = (handler: Handler) =>
  session.withSession(handler, {
    store: new MongoStore({ url: process.env.MONGODB_URI || '' }),
  })

export default withSession
