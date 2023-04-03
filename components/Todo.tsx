import React, { useState } from "react";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import {FiXCircle } from "react-icons/fi";

type Subtask = {
  name: string;
  description: string;
  done: boolean;
};

type Props = {
  data: {
    task_name: string;
    subtasks: Subtask[];
    id: number;
  };
  handleTaskDelete: (index: number) => void;
  index: number;
};

const TodoList: React.FC<Props> = ({ data, handleTaskDelete, index }) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>(data.subtasks);
  const [isDone, setIsDone] = useState<boolean>(
    data.subtasks.every((subtask) => subtask.done)
  );
  const [showSubtasks, setShowSubtasks] = useState<boolean>(false);

  const handleMainTaskChange = () => {
    const updatedSubtasks = subtasks.map((subtask) => ({
      ...subtask,
      done: !isDone,
    }));
    setSubtasks(updatedSubtasks);
    setIsDone(!isDone);
    const taskElement = document.getElementById("main-task");
    if (taskElement) {
      taskElement.innerText = isDone
        ? data.task_name
        : `${data.task_name} - Mark as Done`;
    }
  };

  const handleSubtaskChange = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].done = !updatedSubtasks[index].done;
    setSubtasks(updatedSubtasks);
    setIsDone(updatedSubtasks.every((subtask) => subtask.done));
  };



  return (
    <div className="rounded-2xl bg-white0 p-6 mt-5 flex flex-col">
      <div className="font-bold text-gray-800 text-lg flex items-center justify-between">
        <div className="flex space-x-2">
          <FiXCircle
              className="text-red-500 cursor-pointer m-1 hover:text-black"
               onClick={() => handleTaskDelete(index)}
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
          </div>
        </div>
        <div className="flex">
          <p className="font-thin mr-2">
            {isDone ? "Mark as Incomplete" : "Mark as Complete"}
          </p>
          <input
            type="checkbox"
            className="m-2"
            checked={isDone}
            onChange={handleMainTaskChange}
          />
        </div>
      </div>
      {showSubtasks && (
        <ul className="list-disc list-inside mt-4">
          {subtasks.map((subtask, index) => (
            <li key={index} className="flex items-center">
              <input
                type="checkbox"
                className="mr-3"
                checked={subtask.done}
                onChange={() => handleSubtaskChange(index)}
              />
              <span
                className={
                  subtask.done ? "line-through text-gray-500" : "text-gray-800"
                }
              >
                {subtask.name}
              </span>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
