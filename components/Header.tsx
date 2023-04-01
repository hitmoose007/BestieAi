import React from "react";

interface HeaderProps {
  title: string;
  generateTasks: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, generateTasks }) => {
  return (
    <header className="flex fixed w-screen bg-zinc-300">
      <section className="w-1/2 p-6 text-white">
        <span className="py-2 px-4 border-white border rounded-lg text-zinc-700">
          Avatar
        </span>
      </section>
      <section className="p-2 w-1/2 flex justify-between items-center">
        <span className="py-2 px-4 border-white border rounded-lg text-zinc-700">
          Todo List
        </span>
        <span className="py-2 px-4 mr-2 bg-white shadow-xl cursor-pointer hover:shadow-md border rounded-lg text-zinc-700"
        onClick={() => generateTasks()}
        >
          Generate Tasks
        </span>
      </section>
    </header>
  );
};

export default Header;
