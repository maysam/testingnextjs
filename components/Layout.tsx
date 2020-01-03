import React from "react";
import { NextPage } from "next";
import Header from "./Header";

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: "1px solid #DDD"
};

const withLayout = (Page: NextPage<any>) => {
  const C = (props: any) => (
    <div style={layoutStyle}>
      <Header />
      <Page {...props} />
    </div>
  );
  C.getInitialProps = Page.getInitialProps;

  return C;
};

export default withLayout;
