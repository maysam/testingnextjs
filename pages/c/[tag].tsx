import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
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
  const shows = props.shows
  return (
    <div>
      <h1>{router.query.tag}</h1>

      <h1>Batman TV Shows</h1>
      <ul>
        {shows.map((show: SHOW) => (
          <li key={show.imdbID}>
            <Link href="/p/[id]" as={`/p/${show.imdbID}`}>
              <a>{show.Title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

PostPAGE.getInitialProps = async (context: NextPageContext) => {
  const { tag } = context.query
  const url = `http://www.omdbapi.com/?apikey=bcafd89c&s=${tag}&perpage=3&pagesize=4&page_size=6`
  const res = await fetch(url)
  const data = await res.json()

  const shows = data.Response === 'True' ? data.Search : []

  return { shows }
}

export default PostPAGE
