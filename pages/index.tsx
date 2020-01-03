/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import withLayout from '../components/Layout'
import { NextPage } from 'next'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

interface POST {
  title: string,
  id: string
}

const PostLink = (props:POST) => (
  <>
    <li>
      <Link href={`/post?title=${props.title}`}>
        <a>{props.title}</a>
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
  id: string,
  name: string
}

const Home: NextPage<{ userAgent: string, shows: SHOW[] }> = ({ userAgent, shows }) => (
  <div>
    <h1>Hello world! - user agent: {userAgent}</h1>
    <Blog />
    <h1>Batman TV Shows</h1>
    <ul>
      {shows.map(show => (
        <li key={show.id}>
          <Link href="/p/[id]" as={`/p/${show.id}`}>
            <a>{show.name}</a>
          </Link>
        </li>
      ))}
    </ul>
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

Home.getInitialProps = async ({ req }) => {
  // const q = req.query.q || 'lamb'
  const q = 'dad'
  const url = `https://api.tvmaze.com/search/shows?q=${q}`
  console.log(`fetching ${url}`)
  const res = await fetch(url)
  const data = await res.json()

  const userAgent = req ? req.headers['user-agent'] || '' : navigator.userAgent
  console.log(`Show data fetched. Count: ${data.length}`)

  return {
    userAgent,
    shows: data.map((entry:{show: SHOW}) => entry.show)
  }
}

export default withLayout(Home)
