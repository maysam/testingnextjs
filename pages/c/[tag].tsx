import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { List } from 'antd'
const Link = dynamic(() => import('next/link'))

interface SHOW {
  imdbID: string
  Title: string
}

interface POSTS {
  shows: SHOW[]
}

const PostPAGE: NextPage<POSTS> = props => {
  const router = useRouter()
  const header = <div>Movies with {router.query.tag}</div>
  const shows = props.shows
  return (
    <div>
      <List
        size="small"
        header={header}
        bordered
        dataSource={shows}
        renderItem={item => (
          <List.Item>
            <Link href="/p/[id]" as={`/p/${item.imdbID}`}>
              <a>{item.Title}</a>
            </Link>
          </List.Item>
        )}
      />
    </div>
  )
}

PostPAGE.getInitialProps = async (context: NextPageContext) => {
  const { tag } = context.query
  const url = `//www.omdbapi.com/?apikey=bcafd89c&s=${tag}&perpage=3&pagesize=4&page_size=6`
  const res = await fetch(url)
  const data = await res.json()

  const shows = data.Response === 'True' ? data.Search : []

  return { shows }
}

export default PostPAGE
