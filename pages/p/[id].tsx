/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useRouter } from 'next/router'
import withLayout from '../../components/Layout'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { NextPageContext } from "next";

interface DetailedShow {
  id: string,
  Title: string,
  Plot: string,
  url: string,
  Poster: string,
  Language: string,
  Actors: string
}

const Post = (show: DetailedShow) => {
  const router = useRouter();

  return (
    <div>
      <h1>{router.query.id}</h1>
      <p>This is the blog post content.</p>
      <a href={show.url}>
        <h1>{show.Plot}</h1>
      </a>
      <a href={show.url}>{show.Title}</a>

      <p>{show.Plot.replace(/<[/]?[pb]>/g, "")}</p>
      <img alt="" src={show.Poster} />
      <p>
        <label>Language: </label>

        <Link href="/c/[tag]" as={`/c/${show.Language}`}>
          <a>{show.Language}</a>
        </Link>
      </p>
      <div>
        <h2>Genres</h2>
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
    </div>
  );
};

Post.getInitialProps = async (context: NextPageContext) => {
  const { id } = context.query;
  const url = `http://www.omdbapi.com/?apikey=bcafd89c&i=${id}`;
  const res = await fetch(url);
  const show: DetailedShow = await res.json();

  console.log(`Fetched show: ${show.Title}`);
  console.log({show});

  return show;
};

export default withLayout(Post)
