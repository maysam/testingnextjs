import { NextPage } from 'next'

interface Props {
  userAgent?: string
}

const Agent: NextPage<Props> = ({ userAgent }) => (
  <main>Your user agent: {userAgent && userAgent.split(' ').map(a => <div key={a}>{a}</div>)}</main>
)

Agent.getInitialProps = ({ req }) => {
  // const userAgent: string | undefined = req ? req.headers['user-agent'] : navigator.userAgent
  const userAgent = req ? 'from server ' + req.headers['user-agent'] : 'from client: ' + navigator.userAgent
  return { userAgent }
}

export default Agent
