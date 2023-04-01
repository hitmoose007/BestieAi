import { Layout, Text, Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";

function Home() {
  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 p-4 border-r-2 bg-zinc-300 ">
        <Chat />
      </div>

      <div className="w-1/2 p-4 pt-16">
        <Text variant="h2" className="mb-4">
          Todo List:
        </Text>
        <ul>
          <li>Task 1</li>
          <li>Task 2</li>
          <li>Task 3</li>
          <li>Task 4</li>
        </ul>
      </div>
    </div>
  );
}

Home.Layout = Layout;

export default Home;
