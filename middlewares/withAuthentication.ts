import { ObjectId } from 'mongodb'

const withAuthentication = handler => (req, res) => {
  // withSession should be before withAuthentication so we have a session in the req for withAuthentication
  if (req.session.userId) {
    return req.db
      .collection('users')
      .findOne(new ObjectId(req.session.userId))
      .then(user => {
        if (user) req.user = user
        return handler(req, res)
      })
  }
  return handler(req, res)
}

export default withAuthentication
