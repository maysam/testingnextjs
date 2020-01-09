import { useRouter } from 'next/router'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { NextPageContext } from 'next'

interface DetailedShow {
  id: string
  Title: string
  Plot: string
  url: string
  Poster: string
  Language: string
  Actors: string
  Genre: string
  Country: string
}

const Post = (show: DetailedShow) => {
  const router = useRouter()

  if (show.Title === undefined) {
    return <div>{router.query.id}</div>
  }

  const title = show.url ? (
    <a href={show.url}>
      <h1>{show.Title}</h1>
    </a>
  ) : (
    <h1>{show.Title}</h1>
  )

  return (
    <div>
      {title}

      <code>
        {router.query.id} {show.url}
      </code>
      <p>{show.Plot.replace(/<[/]?[pb]>/g, '')}</p>

      <img alt="" src={show.Poster} />
      <div>
        <h2>Language: </h2>
        <ol>
          {show.Language.split(', ').map(genre => (
            <li key={genre}>
              <Link href="/c/[tag]" as={`/c/${genre}`}>
                <a>{genre}</a>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h2>Actors</h2>
        <ol>
          {show.Actors.split(', ').map(genre => (
            <li key={genre}>
              <Link href="/c/[tag]" as={`/c/${genre}`}>
                <a>{genre}</a>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h2>Genres</h2>
        <ol>
          {show.Genre.split(', ').map(genre => (
            <li key={genre}>
              <Link href="/c/[tag]" as={`/c/${genre}`}>
                <a>{genre}</a>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h2>Country</h2>
        <ol>
          {show.Country.split(', ').map(genre => (
            <li key={genre}>
              <Link href="/c/[tag]" as={`/c/${genre}`}>
                <a>{genre}</a>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

Post.getInitialProps = async (context: NextPageContext) => {
  const { id } = context.query
  const url = `http://www.omdbapi.com/?apikey=bcafd89c&i=${id}`
  const res = await fetch(url)
  const result = await res.json()

  return result['Response'] === 'True' ?  result as DetailedShow : {}
}

export default Post
