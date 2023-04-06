import clsx from "clsx";
import Balancer from "react-wrap-balancer";

// wrap Balancer to remove type errors :( - @TODO - fix this ugly hack
const BalancerWrapper = (props: any) => <Balancer {...props} />;

type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}


// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
    <div className="flex flex-grow space-x-3">
      <div className="min-w-0 flex-1">
        <p className="font-large text-xxl text-gray-900">
          <a href="#" className="hover:underline">
            AI
          </a>
        </p>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
            <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
          </div>
          <div className="h-2 rounded bg-zinc-500"></div>
        </div>
      </div>
    </div>
  </div>
);

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

export function ChatLine({
  role = "assistant",
  content,
  forwardRef,
}: ChatGPTMessage & { forwardRef?: React.ForwardedRef<HTMLDivElement> }) {
  if (!content) {
    return null;
  }
  const formatteMessage = convertNewLines(content);
  return (
    <div
      className={
        role != "assistant" ? "ml-auto clear-both" : "mr-auto clear-both"
      }
      ref={forwardRef}
    >
      <BalancerWrapper>
        <div className="float-right mb-5 rounded-lg bg-white py-2 shadow-lg ring-1 ring-zinc-100 sm:px-6">
          <div className="flex space-x-3">
            <div className="flex-1 gap-4 space-y-2 ">
              <p className="font-large text-xxl text-gray-900 flex space-x-2 w-20">
                <span>
                  <img
                    className="h-5 w-5 rounded-full"
                    src={
                      role == "assistant" ? "/images/ai.png" : "images/pic.png"
                    }
                    alt=""
                  />
                </span>
                <span className="hover:underline text-sm font-thin">
                  {role == "assistant" ? "AI" : "You"}
                </span>
              </p>
              <p
                className={clsx(
                  "text ",
                  role == "assistant" ? "font-semibold font- " : "text-gray-700"
                )}
              >
                {content}
              </p>
            </div>
          </div>
        </div>
      </BalancerWrapper>
    </div>
  );
}
