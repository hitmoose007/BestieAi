import { useEffect, useState, useRef } from "react";
import { type ChatGPTMessage, ChatLine, LoadingChatLine } from "./ChatLine";
import {InputMessage} from "./InputMessage";


// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am a friendly AI assistant. Ask me anything!",
  },
];

export function Chat() {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log("The ref is: ", messagesEndRef.current);
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (e.currentTarget.scrollTop === 0) {
      setOffset(offset + 10);

    }
  };
  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/loadChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            offset: offset,
          }),
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        data.chatHistoryData.forEach((item: any) => {
          setMessages((prev) => [
            { role: "user", content: item.user_message },
            { role: "assistant", content: item.agent_message },
            ...prev,
          ]);
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchMessageHistory();
  },[offset]);

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
    <div className="rounded-2xl bg-white border p-6 mt-16 flex flex-col h-[calc(100vh-6rem)]">
      <div
        id="container"
        className="overflow-y-scroll scrollbar-thin max-h-[calc(100vh-11rem)] min-h-[calc(100vh-11rem)]"
        onScroll={handleScroll}
      >
        <div className="flex-grow">
          {messages.map(({ content, role }, index) => (
            <ChatLine
              key={index}
              role={role}
              content={content}
              forwardRef={messagesEndRef}
            />
          ))}

          {loading && <LoadingChatLine />}

          {messages.length < 2 && (
            <span className="mx-auto flex flex-grow text-gray-600 clear-both">
              Type a message to start the conversation
            </span>
          )}
          <div />
        </div>
      </div>
      <div className="flex-shrink-0">
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          disabled={loading}
        />
      </div>
    </div>
  );
}
