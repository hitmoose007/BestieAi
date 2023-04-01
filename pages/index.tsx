import { Layout, Text, Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";
import TodoList from "../components/Todo";

const tasks = [
  {
    "task_name": "Plan a trip to Austin, TX",
    "subtasks": [
      {
        "name": "Book flights",
        "description": "Find and book the most suitable and affordable flights to Austin."
      },
      {
        "name": "Find accommodations",
        "description": "Research and book suitable accommodations in Austin for the duration of your stay."
      },
      {
        "name": "Create a list of attractions to visit",
        "description": "Research the top attractions and activities in Austin and create a list of places you'd like to visit during your trip."
      },
      {
        "name": "Plan dining experiences",
        "description": "Find popular Austin restaurants, cafes, and bars to visit during your trip."
      },
      {
        "name": "Create a daily itinerary",
        "description": "Organize your activities, attractions, and meals into a daily schedule to make the most of your time in Austin."
      }
    ]
  }
];

function Home() {
  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 p-3 bg-zinc-300 ">
        <Chat />
      </div>

      <div className="w-1/2 p-3 bg-zinc-300 ">
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <TodoList task={task} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Home.Layout = Layout;

export default Home;
