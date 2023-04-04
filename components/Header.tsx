import React from "react";
import { FaUser, FaListUl } from "react-icons/fa";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <nav className="flex fixed w-full bg-zinc-500  p-4 ">
      <div className="w-1/2 flex items-center">
        <div className="h-8 border-r-2 border-gray-700 pr-4 flex items-center">
          <FaUser className="inline-block align-middle mr-2 text-3xl text-white" />
          <h1 className="inline-block align-middle font-semibold text-xl text-white">
            Avatar
          </h1>
        </div>
        <span className="inline-block align-middle font-semibold text-lg text-white ml-4">
          What's on your mind?
        </span>
      </div>
      <div className="w-1/2 flex items-center justify-end">
        <h2 className="inline-block align-middle font-semibold text-lg text-white mr-4">
          Todo List
        </h2>
        <FaListUl className="inline-block align-middle mr-2 text-2xl text-white" />
        <div className="h-8 border-l-2 border-gray-700 pl-4 flex items-center">
          <span className="inline-block align-middle font-semibold text-lg text-white">
            Here are your tasks
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
