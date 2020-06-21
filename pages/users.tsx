import Link from 'next/link'
import { Table } from 'antd'
import { User } from 'types'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(r => r.json())

type Users = User[]

interface Props {
  status?: string
  users?: Users
  count?: integer
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
    render: text => (text ? <strong>You</strong> : <small>Others</small>),
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

const AllUsersTable = ({ users, loading }: Props) => (
  <Table
    bordered
    pagination={{ pageSize: 50, position: 'both' }}
    loading={loading}
    dataSource={users && users.reverse()}
    columns={columns}
    rowKey="_id"
  />
)

function AllUsers({ path, url }) {
  const { data, error, isValidating } = useSWR(path, fetcher)
  console.log({ isValidating, data, path, url })
  return AllUsersTable({ ...data, loading: isValidating })
}

export function getServerSideProps({ req, res }) {
  const path = '/api/users'
  const url = req == undefined ? path : 'http://' + req.headers['host'] + path
  return { props: { path, url } }
}
export default AllUsers
