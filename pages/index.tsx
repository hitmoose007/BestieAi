import { Layout, Text, Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";
import TodoList from "../components/Todo";
import { useState, useEffect } from "react";
import { FaUser, FaListUl } from "react-icons/fa";

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
    //api call to delete task
    const task_id = tasks[index].task_id;
    fetch("/api/deleteTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: task_id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (e.currentTarget.scrollTop === 0) {
      setOffset(offset + 10);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 px-2 pt-12 bg-zinc-500 ">
        <span className="bg-white w-full flex rounded-t-2xl p-2 border-b border-zinc-200">
          <h1 className="inline-block align-middle ml-4 font-semibold text-xl text-zinc-500">
            Avatar
          </h1>
        </span>
        <Chat />
      </div>

      <div className="w-1/2 px-2 pt-12 bg-zinc-500 ">
        <span className="bg-white border-b border-zinc-200 w-full flex rounded-t-2xl  p-2 ">
          <h2 className="inline-block align-middle font-semibold text-lg text-zinc-500 ml-4">
            Todo List
          </h2>
        </span>
        <div
          className="bg-white overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-300 rounded-b-2xl max-h-[calc(100vh-6.1rem)] min-h-[calc(100vh-6.1rem)]"
          onScroll={handleScroll}
        >
          <div className="flex py-4 px-8  justify-end">
            {loading && (
              <div
                className="w-8 h-8 rounded-full animate-spin my-1 mx-2
              border-2 border-solid border-zinc-600 border-t-transparent"
              ></div>
            )}
            <button
              disabled={loading}
              onClick={generateTasks}
              className="bg-transparent hover:bg-zinc-700 text-zinc-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:bg-white"
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
