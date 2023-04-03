import React from "react";

interface HeaderProps {
  title: string;
  generateTasks: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, generateTasks }) => {
  return (
    <header className="flex fixed w-screen bg-zinc-300">
      <section className="w-1/2 p-5 text-white">
        <span className=" py-2 px-4 border-white border rounded-lg bg-white text-zinc-700">
          Avatar
        </span>
      </section>
      <section className="p-2 w-1/2 flex justify-between items-center">
        <span className="py-2 px-4 border-white bg-white border rounded-lg text-zinc-700">
          Todo List
        </span>
        <button
          className="py-2 px-4 mr-2 bg-white border-zinc-400 border-2 shadow-xl cursor-pointer hover:shadow-md hover:bg-zinc-400 hover:text-white rounded-lg text-zinc-700"
          onClick={() => generateTasks()}
        >
          Generate Tasks
        </button>
      </section>
    </header>
  );
};

export default Header;
