/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useRouter } from 'next/router'
import withLayout from '../../components/Layout'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { NextPageContext } from "next";

interface DetailedShow {
  id: string,
  name: string,
  summary: string,
  url: string,
  image: {medium: string},
  language: string,
  genres: string[]
}

const Post = (show: DetailedShow) => {
  const router = useRouter();

  return (
    <div>
      <h1>{router.query.id}</h1>
      <p>This is the blog post content.</p>
      <a href={show.url}>
        <h1>{show.name}</h1>
      </a>
      <a href={show.url}>{show.name}</a>

      <p>{show.summary.replace(/<[/]?[pb]>/g, "")}</p>
      <img alt="" src={show.image && show.image.medium} />
      <p>
        <label>Language: </label>

        <Link href="/c/[tag]" as={`/c/${show.language}`}>
          <a>{show.language}</a>
        </Link>
      </p>
      <div>
        <h2>Genres</h2>
        <ol>
          {show.genres.map(genre => (
            <li key={genre}>
              <Link href="/c/[tag]" as={`/c/${genre}`}>
                <a>{genre}</a>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

Post.getInitialProps = async (context: NextPageContext) => {
  const { id } = context.query;
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  const show: DetailedShow = await res.json();

  console.log(`Fetched show: ${show.name}`);
  console.log(show);

  return show;
};

export default withLayout(Post)
