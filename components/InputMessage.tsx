import { Button } from "./Button";
import { AiOutlineEnter } from "react-icons/ai";
import { useState } from "react";

export function InputMessage({ sendMessage, loading }: any) {
  const [input, setInput] = useState("");

  const send = (message: string) => {
    sendMessage(message);
    setInput("");
  };

  return (
    <div className="flex clear-both bottom-5">
      <input
        type="text"
        aria-label="chat input"
        required
        disabled={loading}
        className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm disabled:bg-gray-100"
        value={input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            send(input);
          }
        }}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      {loading ? (
        <Button type="submit" className="ml-4 flex-none" disabled>
          <span className="animate-pulse">...</span>
        </Button>
      ) : (
        <Button
          type="submit"
          className="ml-4 flex-none"
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
        >
          <AiOutlineEnter />
        </Button>
      )}
    </div>
  );
}
