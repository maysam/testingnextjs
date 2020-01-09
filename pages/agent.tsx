import { NextPage } from 'next'

interface Props {
  userAgent?: string
}

const Page: NextPage<Props> = ({ userAgent }) => <main>Your user agent: {userAgent}</main>

// const Agent = ({ userAgent }) => <h1>Your user agent is: {userAgent}</h1>

Page.getInitialProps = ({ req }) => {
  const userAgent: string | undefined = req ? req.headers['user-agent'] : navigator.userAgent
  return { userAgent }
}

export default Page
