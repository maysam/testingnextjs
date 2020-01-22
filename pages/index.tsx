import React, { useContext } from 'react'
import { UserContext } from '../components/UserContext'
import { NextPage } from 'next'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { Alert, List, Form, Icon, Input, Button } from 'antd'

interface POST {
  title: string
  id: string
}

const PostLink = (props: POST) => (
  <>
    <li>
      <Link href={`/post?title=${props.title}`}>
        <a href={`/post?title=${props.title}`}>{props.title}</a>
      </Link>
    </li>
    <li>
      <Link href="/p/[id]" as={`/p/${props.id}`}>
        <a>{props.id}</a>
      </Link>
    </li>
    <style jsx>{`
      li {
        list-style: none;
        margin: 5px 10dp;
      }

      li:nth-child(odd) a {
        text-decoration: none;
        color: green;
        font-family: 'Arial';
      }

      a:hover {
        opacity: 0.6;
      }
    `}</style>
  </>
)

const Blog = () => {
  return (
    <div>
      <h1>My Blog</h1>
      <ul>
        <PostLink title="Hello Next.js" id="hello-nextjs" />
        <PostLink title="Learn Next.js is awesome" id="learn-nextjs" />
        <PostLink title="Deploy apps with Zeit" id="deploy-nextjs" />
      </ul>
    </div>
  )
}

interface SHOW {
  imdbID: string
  Title: string
  Year: string
}

interface Props {
  userAgent?: string
  shows?: SHOW[]
  message: string
  total: string
}

const Index: NextPage<Props> = ({ userAgent, shows, total, message }) => {
  const footer = <div>Total is {total}</div>
  const {
    state: {
      isLoggedIn,
      user: { name },
    },
  } = useContext(UserContext)
  return (
    <div>
      <div>
        <h1>Hello, {isLoggedIn ? name : 'stranger.'}</h1>

        {!isLoggedIn ? (
          <>
            <Link href="/login">
              <div>
                <button>Login</button>
              </div>
            </Link>
            <Link href="/signup">
              <div>
                <button>Sign up</button>
              </div>
            </Link>
          </>
        ) : (
          <button>Logout</button>
        )}
      </div>
      <Blog />

      <Form layout="inline" onSubmit={() => true}>
        <Form.Item>
          <Input
            name="keyword"
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="keyword"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
      {message || (
        <List
          size="small"
          header={<div>Movies</div>}
          footer={footer}
          bordered
          dataSource={shows}
          renderItem={item => (
            <List.Item>
              <Link href="/p/[id]" as={`/p/${item.imdbID}`}>
                <div>
                  <a>{item.Title}</a> ({item.Year})
                </div>
              </Link>
            </List.Item>
          )}
        />
      )}
      <Alert message={userAgent} type="success" />
      <style jsx>{`
        h1,
        a {
          font-family: 'Arial';
        }

        ul {
          padding: 0;
        }

        li {
          list-style: none;
          margin: 5px 0;
        }

        a {
          text-decoration: none;
          color: blue;
        }

        a:hover {
          opacity: 0.6;
        }
      `}</style>
    </div>
  )
}

Index.getInitialProps = async ({ req, query: { keyword = 'man' } }) => {
  const userAgent = req ? 'from server ' + req.headers['user-agent'] : 'from client: ' + navigator.userAgent
  const url = `http://www.omdbapi.com/?apikey=bcafd89c&s=${keyword || 'keyword'}`
  console.log(`fetching ${url}`)

  function checkStatus(res: Response): Response {
    if (res.ok) {
      // res.status >= 200 && res.status < 300
      return res
    } else {
      console.log({ res })
      throw Error(res.statusText)
    }
  }

  const result = await fetch(url, {})
    .then(checkStatus)
    .then(data => data.json())
    .catch(err => {
      console.error(err)
    })
  const shows = result.Response === 'True' ? result.Search : ([] as SHOW[])
  console.log(`Show data fetched. Count: ${shows.length}`)

  return {
    userAgent,
    shows,
    total: result.totalResults,
    message: result.Error,
  }
}

export default Index
