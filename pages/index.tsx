import { Layout, Text, Page } from "@vercel/examples-ui";
import { Chat } from "../components/Chat";
import TodoList from "../components/Todo";
import { useState, useEffect } from "react";

function Home() {
  const data = [
    {
      task_id: 38,
      task_name: "Identify user's need",
      task_completed: false,
      subtasks: [
        {
          subtask_id: 182,
          subtask_name: "Determine topic",
          subtask_description:
            "Understand what topic or subject the user wants to discuss or needs assistance with.",
          subtask_completed: false,
        },
      ],
    },
    // add more tasks here if needed
  ];

  const [tasks, setTasks] = useState(data);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gen, setGen] = useState(false);

  useEffect(() => {
    const fetchTaskHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/loadTasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offset: offset,
          }),
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log(data);
        data.results.forEach((item: any) => {
          setTasks((prev) => [
            ...prev,
            {
              task_id: item.task_id,
              task_name: item.task_name,
              task_completed: item.task_completed,
              subtasks: item.subtasks,
            },
          ]);
        });

        setLoading(false);
        console.log("Loading tasks: ", loading)
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchTaskHistory();
  }, [offset]);

  const generateTasks = () => {
    setGen(true);
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
        setGen(false);
      })
      .catch((error) => {
        console.error(error);
        setGen(false);
      });
  };

  const handleTaskDelete = (id: number) => {
    const updatedTasks = tasks.filter(task => task.task_id !== id);
    setTasks(updatedTasks);
    //api call to delete task
    fetch("/api/deleteTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
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
    const element = e.target as HTMLElement;
    setTimeout(() => {
      if (
        Math.ceil(element.scrollHeight - element.scrollTop) ===
        element.clientHeight
      ) {
        setOffset(offset + 1);
      }
    }, 2000);
  };

  return (
    <div className='w-full h-screen flex bg-zinc-200'>
      <div className='w-1/2 px-2 pt-12   '>
        <span className='bg-white w-full flex rounded-t-2xl p-2 py-4 '>
          <h1 className='inline-block align-middle ml-4 font-semibold   '>
            Avatar
          </h1>
        </span>
        <Chat />
      </div>

      <div className='w-1/2 px-2 pt-12  '>
        <div className='bg-white border-b border-zinc-200 w-full flex rounded-t-2xl  p-2 py-2  '>
          <button onClick={()=> generateTasks()} className='bg-green-300 text-green-800 ml-4 font-bold py-2 px-4 rounded-lg flex transition-colors duration-500 ease-in-out hover:bg-green-600 hover:text-white'>
            <svg
              preserveAspectRatio='xMidYMin'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden='true'
              className='mt-1'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M20.5929 10.9105C21.4425 11.3884 21.4425 12.6116 20.5929 13.0895L6.11279 21.2345C5.27954 21.7033 4.24997 21.1011 4.24997 20.1451L4.24997 3.85492C4.24997 2.89889 5.27954 2.29675 6.11279 2.76545L20.5929 10.9105Z'
              ></path>
            </svg>
            <span className='px-2'>Generate Tasks</span>
          </button>
          <div className='flex  justify-end'>
            {gen && (
              <div
                className='w-5 h-5 mt-3 rounded-full animate-spin my-1 mx-2
              border-2 border-solid border-zinc-600 border-t-transparent'
              ></div>
            )}
          </div>
        </div>
        <div
          className='bg-white overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-300 rounded-b-2xl max-h-[calc(100vh-6.1rem)] min-h-[calc(100vh-6.1rem)]'
          onScroll={(e) => handleScroll(e)}
        >


          {tasks.map((tasks, index) => (
            <TodoList
              key={tasks.task_id}
              data={tasks}
              handleTaskDelete={handleTaskDelete}
              index={index}
            />
          ))}
          {loading && (
            <div className='flex flex-auto flex-col justify-center items-center p-4 md:p-5'>
              <div className='flex justify-center'>
                <div
                  className='animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full'
                  role='status'
                  aria-label='loading'
                >
                  <span className='sr-only'>Loading...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Home.Layout = Layout;

export default Home;
