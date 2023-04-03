import { Layout, Text, Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";
import TodoList from "../components/Todo";
import { useState } from "react";

function Home() {
  const data = [
    {
      task_name: "Plan a trip to Austin, TX",
      id: 1,
      subtasks: [
        {
          name: "Book flights",
          description:
            "Find and book the most suitable and affordable flights to Austin.",
          done: false,
        },
        {
          name: "Find accommodations",
          description:
            "Research and book suitable accommodations in Austin for the duration of your stay.",
          done: false,
        },
        {
          name: "Create a list of attractions to visit",
          description:
            "Research the top attractions and activities in Austin and create a list of places you'd like to visit during your trip.",
          done: false,
        },
        {
          name: "Plan dining experiences",
          description:
            "Find popular Austin restaurants, cafes, and bars to visit during your trip.",
          done: false,
        },
        {
          name: "Create a daily itinerary",
          description:
            "Organize your activities, attractions, and meals into a daily schedule to make the most of your time in Austin.",
          done: false,
        },
      ],
    },
  ];

  const [tasks, setTasks] = useState(data);

  const handleTaskDelete = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 p-2 bg-zinc-300 ">
        <Chat />
      </div>

      <div className="w-1/2 p-2 bg-zinc-300 ">
        <div className="bg-white mt-16 overflow-y-scroll scrollbar-thin rounded-2xl max-h-[calc(100vh-6.1rem)] min-h-[calc(100vh-6.1rem)]">
          {tasks.map((tasks, index) => (
            <TodoList
              key={index}
              data={tasks}
              handleTaskDelete={handleTaskDelete}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

Home.Layout = Layout;

export default Home;
