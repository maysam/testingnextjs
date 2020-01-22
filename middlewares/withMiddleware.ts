import withDatabase, { Handler } from './withDatabase'
import withAuthentication from './withAuthentication'
import withSession from './withSession'

const middleware = (handler: Handler) => withDatabase(withSession(withAuthentication(handler)))

export default middleware
