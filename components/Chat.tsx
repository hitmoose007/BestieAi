import { useEffect, useState } from "react";
import { Button } from "./Button";
import { type ChatGPTMessage, ChatLine, LoadingChatLine } from "./ChatLine";
import { useCookies } from "react-cookie";
import { AiOutlineEnter } from "react-icons/ai";

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am a friendly AI assistant. Ask me anything!",
  },
];

const InputMessage = ({ input, setInput, sendMessage }: any) => (
  <div className=" flex clear-both bottom-5">
    <input
      type="text"
      aria-label="chat input"
      required
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

export function Chat() {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useCookies([COOKIE_NAME]);

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7);
      setCookie(COOKIE_NAME, randomId);
    }
  }, [cookie, setCookie]);

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    setLoading(true);
    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];
    setMessages(newMessages);
    // const last10messages = newMessages.slice(-10); // remember last 10 messages

    const response = await fetch("/api/sendTextToAvatar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMessage: message,
        // last10messages,
        // cookie: cookie[COOKIE_NAME],
      }),
    });

    console.log("Edge function returned.");
    console.log("This is the response: ", response.body);

    if (!response.ok) {
      console.log("hello");
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
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-300 bg-zinc-200 p-6 mt-16 flex flex-col h-[calc(100vh-6rem)]">
      <div className="overflow-y-scroll scrollbar-thin max-h-[calc(100vh-11rem)] min-h-[calc(100vh-11rem)]">
        <div className="flex-grow">
          {messages.map(({ content, role }, index) => (
            <ChatLine key={index} role={role} content={content} />
          ))}

          {loading && <LoadingChatLine />}

          {messages.length < 2 && (
            <span className="mx-auto flex flex-grow text-gray-600 clear-both">
              Type a message to start the conversation
            </span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
