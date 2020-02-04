import { useRouter } from 'next/router'
// import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
// import { NextPageContext } from 'next'
// import { Tag } from 'antd'
// import { User } from '../../types'

const User = ({ uid, user }) => {
  const router = useRouter()

  if (!user || user.name === undefined) {
    return <div>reouter query id = {uid}</div>
  }
  const url = user.email || 'https://www.imdb.com/title/' + router.query.id

  return (
    <div>
      <a href={url}>
        <h1>{user.name}</h1>
      </a>
    </div>
  )
}

User.getInitialProps = context => {
  const { query, req } = context
  const { uid } = query

  const path = `/api/user/${uid}`
  const url = req == undefined ? path : 'http://' + req.headers['host'] + path

  return fetch(url)
    .then(res => res.json())
    .catch(error => {
      console.log({ error })
      return { uid, user: { _id: '1', name: 'none' } }
    })
}

export default User
