import React, { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

interface Subtask {
  name: string;
  description: string;
  isDone: boolean;
}

interface Task {
  task_name: string;
  subtasks: Subtask[];
}

interface Props {
  task: Task;
}

const TodoList: React.FC<Props> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTaskDone, setIsTaskDone] = useState(false);
  const [subtaskStatus, setSubtaskStatus] = useState(
    task.subtasks.every((subtask) => subtask.isDone)
  );

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTaskToggle = () => {
    const updatedSubtasks = task.subtasks.map((subtask) => ({
      ...subtask,
      isDone: !subtaskStatus,
    }));
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    setIsTaskDone(!isTaskDone);
    setSubtaskStatus(!subtaskStatus);

    // Call a function to update the task with the new subtask list
    updateTask(updatedTask);
  };
  const handleSubtaskToggle = (index: number) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[index].isDone = !updatedSubtasks[index].isDone;

    const isTaskDone = updatedSubtasks.every((subtask) => subtask.isDone);
    setIsTaskDone(isTaskDone);
    setSubtaskStatus(isTaskDone);

    // Update the task with the new subtask list
    const updatedTask = {
      ...task,
      subtasks: updatedSubtasks,
    };
    // Call a function to update the task in your state or database
    updateTask(updatedTask);
  };

  const updateTask = (updatedTask: Task) => {
    // Implement a function to update the task in your state or database
    console.log("Task updated:", updatedTask);
  };

  return (
    <div className="rounded-2xl bg-white border p-6 mt-16 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between mb-4">
        <span className="flex space-x-2">
          <p>{task.task_name}</p>
          <span>
            <IoIosArrowDropdownCircle
              onClick={handleToggle}
              className="cursor-pointer text-2xl"
            />
          </span>
          {isTaskDone && (
            <span className="text-green-500 font-bold">(Done)</span>
          )}
        </span>
        <label>
          <input
            type="checkbox"
            checked={isTaskDone}
            onChange={handleTaskToggle}
            className="mr-2"
          />
          <span>Mark as Done</span>
        </label>
      </div>
      <hr></hr>
      {isExpanded && (
        <ul key={Date.now()}>
          {task.subtasks.map((subtask, index) => (
            <li
              key={subtask.name}
              className={`${subtask.isDone ? "line-through" : ""}`}
            >
              <label>
                <input
                  type="checkbox"
                  checked={subtask.isDone}
                  onChange={() => handleSubtaskToggle(index)}
                  className="mr-2"
                />
                <span>{subtask.name}</span>
              </label>
              <p>{subtask.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
