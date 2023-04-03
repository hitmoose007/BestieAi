import { Button } from "./Button";
import { AiOutlineEnter } from "react-icons/ai";

export function InputMessage({ input, setInput, sendMessage, disabled }: any) {
  return (
    <div className=" flex clear-both bottom-5">
      <input
        type="text"
        aria-label="chat input"
        required
        disabled={disabled}
        className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm"
        value={input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(input);
            setInput("");
          }
        }}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
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
    </div>
  );
}
