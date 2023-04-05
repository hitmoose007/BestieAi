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
  const [disabled, setDisabled] = useState(false);

  console.log('hello')
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && messagesEndRef.current) {
      if (
        offset === 0 ||
        messagesEndRef.current.getBoundingClientRect().bottom <=
          window.innerHeight
      ) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
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
  }, [offset]);

  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    setLoading(true);
    setDisabled(true);
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
      setDisabled(false);
    }
  };

  return (
    <div className="rounded-b-2xl bg-white border p-6 flex flex-col h-[calc(100vh-6rem)]">
      <div
        id="container"
        className="overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-300 max-h-[calc(100vh-11rem)] min-h-[calc(100vh-11rem)]"
        onScroll={handleScroll}
      >
        <div className="flex-grow">
          {loading && (
            <div className="text-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
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
          sendMessage={sendMessage}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
