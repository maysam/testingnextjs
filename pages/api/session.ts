import withMiddleware from 'middlewares/withMiddleware'

const handler = (req, res) => {
  if (req.method === 'GET') {
    if (req.user) {
      const { _id, name, email } = req.user
      return res.status(200).send({
        status: 'ok',
        data: {
          isLoggedIn: true,
          user: { _id, name, email },
        },
      })
    }
    return res.status(200).send({
      status: 'ok',
      data: {
        isLoggedIn: false,
        user: {},
      },
    })
  }
  if (req.method === 'DELETE') {
    delete req.session.userId
    return res.status(200).send({
      status: 'ok',
      data: {
        isLoggedIn: false,
        message: 'You have been logged out.',
      },
    })
  }
  return res.status(405).end()
}

export default withMiddleware(handler)
