import { applySession, Store, MemoryStore, promisifyStore } from 'next-session'
import connectMongo from 'connect-mongo'

import { Handler } from './withDatabase'

const withMongoSession = (handler: Handler) => async (req, res) => {
  const MongoStore = connectMongo({ Store, MemoryStore })
  const mongoStoreOptions = {
    client: req.dbClient,
    stringify: false,
    // url: databaseUrl,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }

  const mongoStore = new MongoStore(mongoStoreOptions)
  const options = {
    store: promisifyStore(mongoStore),
  }

  await applySession(req, res, options)
  req.session.views = req.session.views ? req.session.views + 1 : 1

  return handler(req, res)
}

export default withMongoSession
