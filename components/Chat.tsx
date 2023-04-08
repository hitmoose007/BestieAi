import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { type ChatGPTMessage, ChatLine, LoadingChatLine } from "./ChatLine";
import { InputMessage } from "./InputMessage";
import { ViewportList } from "react-viewport-list";
//react virtualized
import { List, AutoSizer } from "react-virtualized";

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
  const [fetching, setFetching] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [defaultAvatar, setDefaultAvatar] = useState("");
  const [defaultName, setDefaultName] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && messagesEndRef.current && !hasScrolledToBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setHasScrolledToBottom(true);
      if (offset <= 1) {
        setHasScrolledToBottom(false);
      }
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && lastMessage && messagesEndRef.current) {
        if (
          offset >= 0 ||
          messagesEndRef.current.getBoundingClientRect().bottom <=
            window.innerHeight
        ) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [messages, offset, hasScrolledToBottom]);

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
        data.chatHistoryData.forEach(
          (item: any) => {
            console.log("item", item);
            if (item.imageUrl !== null) {

              setMessages((prev) => [
                { role: "user", content: item.user_message },
                {
                  role: "assistant",
                  content: item.agent_message,
                  imageUrl: item.imageUrl,
                  name: item.avatarName,
                },
                ...prev,
              ]);
            } else
              setMessages((prev) => [
                { role: "user", content: item.user_message },
                { role: "assistant", content: item.agent_message },
                ...prev,
              ]);
          }
        );

        setFetching(false);
      } catch (error) {
        console.error(error);
        setFetching(false);
      }
    };
    const fetchDefaultMessage = async () => {
      try {
        setFetching(true);
        const response = await fetch("/api/defaultAvatar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }
        //parse response to json
        const data = await response.json();
        setDefaultAvatar(data.image_url);
        setDefaultName(data.name);
      } catch (error) {
        console.error(error);
        setFetching(false);
      }
    };
    fetchMessageHistory();
    if (offset === 0) {
      fetchDefaultMessage();
    }
  }, [offset]);

  const sendMessage = async (message: string) => {
    setLoading(true);
    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];
    setMessages(newMessages);

    const response = await fetch("/api/sendTextToAvatar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMessage: message,
      }),
    });


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
        {
          role: "assistant",
          content: parsed.content,
          imageUrl: parsed.image_url,
          name: parsed.name,
        } as ChatGPTMessage,
      ]);

      setLoading(false);
    }
  };

  const chatList = useMemo(
    () => (
      <ViewportList
        viewportRef={viewRef}
        items={messages}
        scrollThreshold={0.9} //size
        overscan={10} //size
        itemSize={100} //size
      >
        {(item, index) => (
          <ChatLine
            key={index}
            content={item.content}
            role={item.role}
            imageUrl={item.imageUrl}
            name={item.name}
            defaultAvatar={defaultAvatar}
            defaultName={defaultName}
          />
        )}
      </ViewportList>
    ),
    [messages, defaultAvatar, defaultName]
  );

  return (
    <div className='rounded-b-2xl bg-white border p-6 flex flex-col h-[calc(100vh-7rem)]'>
      <div
        id='container'
        ref={containerRef}
        className='overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-300 max-h-[calc(100vh-11rem)] min-h-[calc(100vh-11rem)]'
        onScroll={handleScroll}
      >
        <div className='flex-grow'>
          {fetching && (
            <div className='flex flex-auto flex-col justify-center items-center p-4 md:p-5'>
              <div className='flex justify-center'>
                <div
                  className='animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full'
                  role='status'
                  aria-label='loading'
                >
                  <span className='sr-only'>Loading...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={viewRef} className='flex flex-col'>
            {chatList}
            <div ref={messagesEndRef}></div>
          </div>

          {loading && <LoadingChatLine />}

          {messages.length < 2 && (
            <span className='mx-auto flex flex-grow text-gray-600 clear-both'>
              Type a message to start the conversation
            </span>
          )}
          <div />
        </div>
      </div>
      <div className='flex-shrink-0'>
        <InputMessage sendMessage={sendMessage} />
      </div>
    </div>
  );
}
