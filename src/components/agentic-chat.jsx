"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Send, X, MessageCircle } from "lucide-react";



export function AgenticChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm PCMA Assistant. How can I help you today? I can help with appointment scheduling, answer medical questions, or provide health recommendations.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage= {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/agentic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages,
        }),
      });

      let botResponseText;

      if (response.ok) {
        const data = await response.json();
        botResponseText = data.response;
      } else {
        botResponseText = generateDemoResponse(input);
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Even on error, fall back to demo response
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: generateDemoResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("appointment") || lowerInput.includes("book") || lowerInput.includes("schedule")) {
      return "I can help you book an appointment! Would you like me to guide you through the booking process? You can also visit our booking page directly to get started.";
    }
    if (lowerInput.includes("symptom") || lowerInput.includes("sick") || lowerInput.includes("pain")) {
      return "Based on your symptoms, I recommend seeing a general practitioner or a specialist. Could you tell me more details about your symptoms? In the meantime, you can browse our available doctors by specialization.";
    }
    if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("fee")) {
      return "Our consultation fees vary depending on the doctor and appointment type. Video consultations typically cost less than in-clinic visits. Visit our pricing page to see more details.";
    }
    if (lowerInput.includes("online") || lowerInput.includes("video")) {
      return "Yes, we offer video consultations with qualified doctors. These are perfect for follow-ups, minor consultations, or if you prefer to consult from home.";
    }

    return "That's a great question! Could you provide more details? I'm here to help with appointment bookings, medical recommendations, or general health inquiries.";
  };

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center text-primary-foreground transition-all z-40 hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-screen sm:h-[600px] rounded-lg shadow-2xl bg-background border border-border flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary/10">
            <div>
              <h3 className="font-semibold text-foreground">PCMA Assistant</h3>
              <p className="text-xs text-foreground/60">AI-Powered Support</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-border p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}