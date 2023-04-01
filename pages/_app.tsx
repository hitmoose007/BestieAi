import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import type { LayoutProps } from "@vercel/examples-ui/layout";

import { getLayout } from "@vercel/examples-ui";

import "@vercel/examples-ui/globals.css";
import Header from "../components/Header";

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component);

  const generateTasks = () => {
    console.log("Generate Tasks");
    //will get the generated tasks and then pass them to the TodoList component
  };

  return (
    <>
      <Header title="Avatar" generateTasks={generateTasks}/>
      <Component {...pageProps} />
    </>
  );
}

export default App;
