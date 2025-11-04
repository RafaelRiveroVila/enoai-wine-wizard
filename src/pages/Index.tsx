import { useState } from "react";
import Hero from "@/components/Hero";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
    // Smooth scroll to chat
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <main className="min-h-screen">
      <Hero onStartChat={handleStartChat} />
      {showChat && <ChatInterface />}
    </main>
  );
};

export default Index;
