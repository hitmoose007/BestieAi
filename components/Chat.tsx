import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { type ChatGPTMessage, ChatLine, LoadingChatLine } from "./ChatLine";
import { InputMessage } from "./InputMessage";
//react virtualized
import { List, CellMeasurer, CellMeasurerCache } from "react-virtualized";

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
  const [fetching, setFetching] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  );


  const handleScroll = useCallback(({ scrollTop }) => {
    setScrollTop(scrollTop);
    if (scrollTop === 0) {
      setOffset((prev) => prev + 10);
      console.log("offset", offset);
    }
  }, []);

 

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
        cache.current.clearAll(); // clear height cache for all cells
        //set scroll to top

        setFetching(false);
      } catch (error) {
        console.error(error);
        setFetching(false);
      }
    };
    fetchMessageHistory();
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
    }
  };
  function rowRenderer({ index, key, style, parent }) {
    const item = messages[index];
    return (
      <CellMeasurer
        key={key}
        cache={cache.current}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div key={key} style={style}>
          <ChatLine
            key={index}
            forwardRef={index === messages.length - 1 ? messagesEndRef : null}
            content={item.content}
            role={item.role}
          />
        </div>
      </CellMeasurer>
    );
  }

  return (
    <div className="rounded-b-2xl bg-white border p-6 flex flex-col h-[calc(100vh-7rem)]">
      <div
        id="container"
        ref={containerRef}
        className=" scrollbar-thin scrollbar-thumb-zinc-300 max-h-[calc(100vh-11rem)] min-h-[calc(100vh-11rem)]"
        //if try to scroll up even if no scroll
      >
        <div className="flex-grow relative">
          {fetching && (
            <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5 absolute z-50">
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

          <List
            width={containerRef.current?.clientWidth || 300}
            height={containerRef.current?.clientHeight || 300}
            rowHeight={cache.current.rowHeight}
            rowCount={messages.length}
            rowRenderer={rowRenderer}
            scrollTop={scrollTop}
            onScroll={handleScroll}
            deferredMeasurementCache={cache.current}
          />

          {messages.length < 2 && (
            <span className="mx-auto flex flex-grow text-gray-600 clear-both">
              Type a message to start the conversation
            </span>
          )}
          <div />
        </div>
      </div>
      <div className="flex-shrink-0">
        <InputMessage sendMessage={sendMessage} loading={loading} />
      </div>
    </div>
  );
}
