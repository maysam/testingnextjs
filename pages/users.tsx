import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { Table } from 'antd'
import { User } from '../types'

type Users = User[]

interface Props {
  users?: Users
}

const stringSorter = field => (a, b) =>
  a[field] === undefined || a[field] < b[field] ? -1 : b[field] === undefined || a[field] > b[field] ? 1 : 0

const linkToUserPage = (text, { _id }) => (
  <Link href="/user/[id]" as={`/user/${_id}`}>
    <a>{text}</a>
  </Link>
)

const columns = [
  {
    title: 'ID',
    dataIndex: 'self',
    key: 'id',
    render: text => (text && <strong>You</strong>) || <small>Others</small>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: linkToUserPage,
    sorter: stringSorter('name'),
  },
  {
    title: 'Mobile',
    dataIndex: 'mobile',
    key: 'mobile',
    sorter: stringSorter('mobile'),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: stringSorter('email'),
  },
  {
    title: 'National ID',
    dataIndex: 'nid',
    key: 'nid',
    sorter: stringSorter('nid'),
  },
]

const AllUsers = ({ users }: Props) => (
  <Table
    bordered
    pagination={{ pageSize: 50, position: 'both' }}
    loading={!users}
    dataSource={users && users.reverse()}
    columns={columns}
    rowKey="_id"
  />
)

AllUsers.getInitialProps = ({ req }) => {
  const path = '/api/users'
  const url = req == undefined ? path : 'http://' + req.headers['host'] + path

  // return fetch(url, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     // cookie: req && req.session.userId,
  //   },
  // })

  return fetch(url)
    .then(data => data.json())
    .catch(err => {
      console.warn({ err })
    })
}
export default AllUsers
