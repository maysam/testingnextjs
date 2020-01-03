import React from "react";
import withLayout from "../components/Layout";

import { NextPage } from "next";

const Home: NextPage<{}> = () => <h1>About maysam</h1>;

export default withLayout(Home);
