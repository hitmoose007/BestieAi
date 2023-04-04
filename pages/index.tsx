import { Layout, Text, Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";
import TodoList from "../components/Todo";
import { useState, useEffect } from "react";

function Home() {
  const data = [
    {
      task_id: 38,
      task_name: "Identify user's need",
      subtasks: [
        {
          id: 182,
          name: "Determine topic",
          description:
            "Understand what topic or subject the user wants to discuss or needs assistance with.",
        },
        {
          id: 183,
          name: "Provide relevant advice or assistance",
          description:
            "Based on the user's topic or needs, offer helpful guidance and support.",
        },
      ],
    },
    // add more tasks here if needed
  ];

  const [tasks, setTasks] = useState(data);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchTaskHistory = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch("/api/loadTask", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           offset: offset,
  //         }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(response.statusText);
  //       }

  //       const data = await response.json();
  //       console.log(data);

  //       setLoading(false);
  //     } catch (error) {
  //       console.error(error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchTaskHistory();
  // }, [offset]);

  const generateTasks = () => {
    setLoading(true);
    fetch("/api/generateTasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.result);
        setTasks((prev) => [data.result, ...prev]);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleTaskDelete = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (e.currentTarget.scrollTop === 0) {
      setOffset(offset + 10);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 p-2 bg-zinc-300 ">
        <Chat />
      </div>

      <div className="w-1/2 p-2 bg-zinc-300 ">
        <div
          className="bg-white mt-16 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-600 rounded-2xl max-h-[calc(100vh-6.1rem)] min-h-[calc(100vh-6.1rem)]"
          onScroll={handleScroll}
        >
          <div className="flex py-4 px-8  justify-end">
            {
              loading &&
              <div
              className="w-8 h-8 rounded-full animate-spin my-1 mx-2
              border-2 border-solid border-zinc-600 border-t-transparent"
              ></div>
            }
            <button
              disabled={loading}
              onClick={generateTasks}
              className="bg-transparent hover:bg-zinc-700 text-zinc-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Generate Tasks
            </button>
          </div>
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
