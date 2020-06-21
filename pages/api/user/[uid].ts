import withMiddleware from 'middlewares/withMiddleware'
import User from 'models/userModel'
import { ObjectId } from 'mongodb'

const handler = (req, res) => {
  const {
    session: { userId },
  } = req
  const {
    query: { uid },
  } = req
  return (
    User.findOne({ _id: new ObjectId(uid || userId) })
      // .then(data => data.json())
      .then(user => {
        console.log(user)
        res.send({ user })
      })
      .catch(error =>
        res.send({
          status: 'error',
          message: error.toString(),
        })
      )
  )
  return res.status(405).end()
}

export default withMiddleware(handler)
