"use client";
import { useState } from "react";

export default function Home() {
  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Yo, this is Mahesh's ChatterBot! How can I help you today?",
    },
  ]);

  const callGetResponse = async () => {
    if (!theInput.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: theInput }];
    setMessages(updatedMessages);
    setTheInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Server error:", error);
        return;
      }

      const data = await res.json();
      const { output } = data;

      setMessages((prev) => [...prev, output]);
    } catch (error) {
      console.error("Error calling OpenAI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const Submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      callGetResponse();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 py-5">
      <h1 className="text-5xl font-sans">MaheshBot</h1>

      <div className="flex h-[35rem] w-[40rem] flex-col items-center bg-gray-600 rounded-xl">
        <div className="h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
          {messages.map((e, idx) => (
            <div
              key={idx}
              className={`w-max max-w-[18rem] rounded-md px-4 py-3 h-min ${
                e.role === "assistant"
                  ? "self-start bg-gray-200 text-gray-800"
                  : "self-end bg-gray-800 text-gray-50"
              }`}
            >
              {e.content}
            </div>
          ))}
          {isLoading && (
            <div className="self-start bg-gray-200 text-gray-800 w-max max-w-[18rem] rounded-md px-4 py-3 h-min">
              *thinking*
            </div>
          )}
        </div>

        <div className="relative w-[80%] bottom-4 flex justify-center">
          <textarea
            value={theInput}
            onChange={(e) => setTheInput(e.target.value)}
            onKeyDown={Submit}
            className="w-[85%] h-10 px-3 py-2 resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none"
            placeholder="Type your message..."
          />
          <button
            onClick={callGetResponse}
            className="w-[15%] bg-blue-500 px-4 py-2 rounded-r text-white"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
