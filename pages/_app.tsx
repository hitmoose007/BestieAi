import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import type { LayoutProps } from "@vercel/examples-ui/layout";

import { getLayout } from "@vercel/examples-ui";

import "@vercel/examples-ui/globals.css";
import Header from "../components/Header";

function App({ Component, pageProps }: AppProps) {
  const Layout = getLayout<LayoutProps>(Component);

  const generateTasks = async () => {
    try {
      const messageResponse = await fetch("/api/loadChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offset: 0,
        }),
      });

      if (!messageResponse.ok) {
        throw new Error(messageResponse.statusText);
      }

      const messageData = await messageResponse.json();

      const taskResponse = await fetch("/api/generateTasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Chat_History: messageData.chatHistoryData,
        }),
      });

      if (!taskResponse.ok) {
        throw new Error(taskResponse.statusText);
      }

      const taskData = await taskResponse.json();

      console.log(taskData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header title="Avatar" generateTasks={generateTasks} />
      <Component {...pageProps} />
    </>
  );
}

export default App;
