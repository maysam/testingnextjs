/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useRouter } from "next/router";
import withLayout from "../../components/Layout";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { NextPage, NextPageContext } from "next";

interface SHOW {
  id: string;
  name: string;
}

interface POSTS {
  shows: SHOW[]
}

const PostPAGE: NextPage<POSTS> = props => {
  const router = useRouter();
  const shows = props.shows
  return (
    <div>
      <h1>{router.query.tag}</h1>

      <h1>Batman TV Shows</h1>
      <ul>
        {shows.map((show: SHOW) => (
          <li key={show.id}>
            <Link href="/p/[id]" as={`/p/${show.id}`}>
              <a>{show.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
// interface QUERY {
//   tag: string
// }
// interface CONTEXT {
//   query: QUERY,
//   a: {
//     b: string
//   }
// }
interface ENTRY {
  show: SHOW;
}
PostPAGE.getInitialProps = async (context: NextPageContext) => {
  const { tag } = context.query;
  const res = await fetch(
    `https://api.tvmaze.com/search/shows?q=${tag}&perpage=3&pagesize=4&page_size=6`
  );
  const data = await res.json();
  console.log(`Show data fetched. Count: ${data.length}`);

  return { shows: data.map((entry: ENTRY) => entry.show) };
};

export default withLayout(PostPAGE);
