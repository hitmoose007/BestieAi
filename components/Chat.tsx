import { useEffect, useState, useRef } from "react";
import { type ChatGPTMessage, ChatLine, LoadingChatLine } from "./ChatLine";
import { InputMessage } from "./InputMessage";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am a friendly AI assistant. Ask me anything!",
  },
];

export function Chat() {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [fetching , setFetching] = useState(false);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && lastMessage && messagesEndRef.current) {
        if (
          offset >= 0 ||
          messagesEndRef.current.getBoundingClientRect().bottom <=
            window.innerHeight
        ) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          console.log("scrolling to", messagesEndRef.current);
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [messages, offset]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (e.currentTarget.scrollTop === 0) {
      setOffset(offset + 10);
    }

  };
  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        setFetching(true);
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

        setFetching(false);
      } catch (error) {
        console.error(error);
        setFetching(false);
      }
    };
    fetchMessageHistory();


  }, [offset]);

  return (
    <div className="rounded-b-2xl bg-white border p-6 flex flex-col h-[calc(100vh-6rem)]">
      <div
        id="container"
        ref={containerRef}
        className="overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-300 max-h-[calc(100vh-11rem)] min-h-[calc(100vh-11rem)]"
        onScroll={handleScroll}
      >
        <div className="flex-grow">
          {fetching && (
            <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
              <div className="flex justify-center">
                <div
                  className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          )}

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
          setMessages={setMessages}
          messages={messages}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}
