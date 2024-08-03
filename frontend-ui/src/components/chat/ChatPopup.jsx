"use client";

import { useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';

function ChatPopup() {
    const { user } = useAuthenticator((context) => [context.user]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    
    const onSend = async () => {
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMessages),
            });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const res = await response.json();
        setMessages([...newMessages, { role: "FitBot", content: res }]);
        } catch (error) {
            console.error("Error fetching chat response:", error);
        }
  };

  return (
    <div className="fixed left-5 right-5 bottom-5 top-20 p-4 bg-white border border-gray-300 rounded shadow-lg flex flex-col max-w-[95vw] max-h-[90vh]">
      <div className="chat-header text-xl font-bold mb-2">FitBot Chat</div>
      <div className="chat-content overflow-y-auto flex-grow mb-2">
      {messages.map((msg, index) => (
        <div
            key={index}
            className={`chat-message ${
            msg.role === "user" ? "text-right" : "text-left"
            }`}
        >
            <strong>
            {msg.role === "user" ? user.username : msg.role}
            </strong>: {msg.content}
        </div>
        ))}
      </div>
      <div className="chat-input flex">
        <input
          className="w-full px-4 py-1 mr-3 leading-tight text-gray-700 break-words bg-transparent border-none appearance-none dark:text-gray-200 flex-grow-1 focus:outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
        />
        <button
          className="px-3 font-medium text-gray-500 uppercase border border-gray-300 rounded dark:border-gray-100 dark:text-gray-200 hover:border-blue-500 hover:text-blue-500"
          onClick={onSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPopup;
