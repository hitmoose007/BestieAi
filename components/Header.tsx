import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex fixed w-screen bg-zinc-300 border-b-2">
      <section className="w-1/2 p-5 text-white">
        <span className="py-2 px-4 bg-white shadow-lg rounded-lg text-zinc-700"> Avatar</span>
      </section>
      <section className="p-5">
        <p>To Do</p>
      </section>
    </header>
  );
};

export default Header;
