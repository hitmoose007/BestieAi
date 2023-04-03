import type { AppProps } from "next/app";
import type { LayoutProps } from "@vercel/examples-ui/layout";

import { getLayout } from "@vercel/examples-ui";

import "@vercel/examples-ui/globals.css";
import Header from "../components/Header";

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component);



  return (
    <>
      <Header title="Avatar" />
      <Component {...pageProps} />
    </>
  );
}

export default App;
