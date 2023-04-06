import { Button } from "./Button";
import { AiOutlineEnter } from "react-icons/ai";
import { useState } from "react";
import {type ChatGPTMessage} from "./ChatLine";
import {useMemo} from "react";

export function InputMessage({setMessages, messages, setLoading }: any) {
  const [input, setInput] = useState("");
  const [disabled, setDisabled] = useState(false);

  const sendMessage = async (message: string) => {
    setLoading(true);
    setDisabled(true);
    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];
    setMessages(newMessages);
    setInput("");

    const response = await fetch("/api/sendTextToAvatar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMessage: message,

      }),
    });

    console.log("Edge function returned.");
    console.log("This is the response: ", response.body);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;
      const parsed = JSON.parse(lastMessage);

      setMessages([
        ...newMessages,
        { role: "assistant", content: parsed.content } as ChatGPTMessage,
      ]);

      setLoading(false);
      setDisabled(false);
    }
  };
  //move input inside useMemo
  const textInput = useMemo(() => (
    <input
      type="text"
      aria-label="chat input"
      required
      disabled={disabled}
      className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm disabled:bg-gray-100"
      value={input}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          sendMessage(input);
        }
      }}
      onChange={(e) => {
        setInput(e.target.value);
      }}
    />
  ), [input, disabled]);
  return (
    <div className=" flex clear-both bottom-5">
      {textInput}
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
