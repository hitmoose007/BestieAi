import React from "react";
import { FaUser, FaListUl } from "react-icons/fa";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <nav className="flex fixed w-full bg-blue-500 p-4">
      <div className="w-1/2 text-gray-700">
        <FaUser className="inline-block align-middle mr-2 text-3xl" />
        <span className="inline-block align-middle font-semibold text-xl">
          Avatar
        </span>
      </div>
      <div className="w-1/2 flex justify-end items-center">
        <span className="mr-4 text-gray-500">
          <FaListUl className="inline-block align-middle mr-2 text-2xl" />
          Todo List
        </span>
      </div>
    </nav>
  );
};

export default Header;
