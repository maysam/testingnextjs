import withDatabase, { Handler } from 'middlewares/withDatabase'
import withAuthentication from 'middlewares/withAuthentication'
import withSession from 'middlewares/withSession'

const middleware = (handler: Handler) => withDatabase(withSession(withAuthentication(handler)))

export default middleware
