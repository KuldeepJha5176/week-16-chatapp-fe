import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(["hi there", "hello"]);
  const wsRef = useRef<WebSocket | null>(null); // Typed WebSocket reference
  const inputRef = useRef<HTMLInputElement | null>(null); // Typed input reference

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // WebSocket protocol
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen bg-black">
      <br />
      <br />
      <br />
      <div className="h-[85vh]">
        {messages.map((message, index) => (
          <div key={index} className="m-8">
            <span className="bg-white text-black rounded p-4">{message}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-white flex">
        <input ref={inputRef} id="message" className="flex-1 p-4"></input>
        <button
          onClick={() => {
            const message = inputRef.current?.value; // Safely access input value
            if (message && wsRef.current) {
              // Ensure WebSocket is initialized and message is valid
              wsRef.current.send(
                JSON.stringify({
                  type: "chat",
                  payload: {
                    message: message,
                  },
                })
              );
              if (inputRef.current) {
                inputRef.current.value = ""; // Clear the input field safely
              }
            }
          }}
          className="bg-purple-600 text-white p-4"
        >
          Send message
        </button>
      </div>
    </div>
  );
}

export default App;
