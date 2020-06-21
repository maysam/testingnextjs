import { NextPage } from 'next'
import Link from 'next/link'
import { Empty, Table } from 'antd'

import { User } from '../types'

interface Props {
  user?: User
  uid?: string | string[]
}

const UserPage: NextPage<Props> = ({ uid, user }) => {
  console.log({ uid, user })
  if (!user) return <Empty />

  const columns = [
    {
      title: 'ID',
      dataIndex: 'self',
      key: 'id',
      render: text => (text && <strong>You</strong>) || <small>others</small>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: function linkToUserPage(text, { _id }) {
        return (
          <Link href="/user/[id]" as={`/user/${_id}`}>
            <a>{text}</a>
          </Link>
        )
      },
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'National ID',
      dataIndex: 'nid',
      key: 'nid',
    },
  ]
  return <Table dataSource={[user]} columns={columns} rowKey="_id" />
}

UserPage.getInitialProps = async ({ query: { uid } }) => {
  return { uid, user: { _id: '1', name: 'maysam' } }
}

export default UserPage
