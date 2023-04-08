import React, { useState } from "react";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { FiXCircle } from "react-icons/fi";

type Subtask = {
  subtask_id: number;
  subtask_name: string;
  subtask_description: string;
  subtask_completed: boolean;
};

type Props = {
  data: {
    task_name: string;
    task_id: number;
    task_completed: boolean;
    subtasks: Subtask[];
  };
  handleTaskDelete: (id: number) => void;
  index: number;
};

const TodoList: React.FC<Props> = ({ data, handleTaskDelete, index }) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>(data.subtasks);
  const [isDone, setIsDone] = useState<boolean>(
    data.subtasks.every((subtask) => subtask.subtask_completed)
  );
  const [showSubtasks, setShowSubtasks] = useState<boolean>(false);

  const handleMainTaskChange = () => {
    const updatedSubtasks = subtasks.map((subtask) => ({
      ...subtask,
      subtask_completed: !isDone,
    }));
    setSubtasks(updatedSubtasks);
    setIsDone(!isDone);
    const taskElement = document.getElementById("main-task");
    if (taskElement) {
      taskElement.innerText = isDone
        ? data.task_name
        : `${data.task_name} - Mark as Done`;
    }

    updatedSubtasks.forEach((subtask) => {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: subtask.subtask_id,
          completed: subtask.subtask_completed,
        }),
      };

      fetch(`/api/updateSubTaskStatus`, requestOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
    });

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: data.task_id,
        completed: !isDone,
      }),
    };
    fetch(`/api/updataTaskStatus`, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };

  const handleSubtaskChange = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].subtask_completed =
      !updatedSubtasks[index].subtask_completed;
    setSubtasks(updatedSubtasks);
    setIsDone(updatedSubtasks.every((subtask) => subtask.subtask_completed));

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: updatedSubtasks[index].subtask_id,
        completed: updatedSubtasks[index].subtask_completed,
      }),
    };

    fetch(`/api/updateSubTaskStatus`, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };

  return (
    <div
      className={`rounded-2xl bg-white p-6 m-5 flex flex-col ${
        index === 0 ? "border-b-2" : ""
      } border-green-600 `}
    >
      <div className="font-bold text-gray-800 text-lg flex items-center justify-between">
        <div className="flex space-x-2">
          <input
            type="checkbox"
            checked={isDone}
            onChange={handleMainTaskChange}
          />

          <span
            className={isDone ? "line-through text-gray-500" : "text-gray-800"}
          >
            {data.task_name}
          </span>
          <div className="flex text-xl">
            {showSubtasks ? (
              <IoIosArrowDropup
                className="text-gray-500 cursor-pointer m-1  hover:text-black"
                onClick={() => setShowSubtasks(false)}
              />
            ) : (
              <IoIosArrowDropdown
                className="text-gray-500 cursor-pointer m-1   hover:text-black"
                onClick={() => setShowSubtasks(true)}
              />
            )}
            {index === 0 && (
              <span className="text-green-500 border-red-500 ml-2 mb-2 text-xs">
                New!
              </span>
            )}
          </div>
        </div>
        <div className="flex">
          <FiXCircle
            className="text-red-500 cursor-pointer m-1 hover:text-black"
            onClick={() => handleTaskDelete(data.task_id)}
          />
        </div>
      </div>
      {showSubtasks && (
        <ul className="list-disc list-inside mt-4 pl-8">
          {subtasks.map((subtask, index) => (
            <li key={index} className="flex items-center">
              
              <div className="flex flex-col">
                <div>
               <input
                type="checkbox"
                className="mr-3  "
                checked={subtask.subtask_completed}
                onChange={() => handleSubtaskChange(index)}
              /> <span
                  className={
                    subtask.subtask_completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }
                >
                  {subtask.subtask_name}
                </span></div>

                <span
                  className={
                    `ml-8  ${
                    subtask.subtask_completed 
                      ? " line-through text-gray-500 text-xs"
                      : " text-gray-500 text-xs"}`
                  }
                >
                    {/* {subtask.subtask_completed && "Completed - "} */}
                  {subtask.subtask_description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
