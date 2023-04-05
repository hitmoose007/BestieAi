import React from "react";
import { FaUser, FaListUl } from "react-icons/fa";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <nav className="flex fixed w-full bg-zinc-500  p-1 ">
      <div className="w-1/2 flex items-center">
        <div className="h-8 border-r-2 border-gray-700 pr-4 flex items-center">
        </div>
        <span className="inline-block align-middle font-semibold text-lg text-white ml-4">
          What's on your mind?
        </span>
      </div>
      <div className="w-1/2 flex items-center justify-end">
        <div className="h-8 border-r-2 border-gray-700 pr-4 flex items-center mr-3">
          <span className="inline-block align-middle font-semibold text-lg text-white">
            Here are your tasks
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
