import { useState } from "react";
import Hero from "@/components/Hero";
import ChatInterface from "@/components/ChatInterface";
import ProfileButton from "@/components/ProfileButton";
import ProfilePanel from "@/components/ProfilePanel";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
      <ProfileButton onClick={() => setProfileOpen(true)} />
      <ProfilePanel open={profileOpen} onOpenChange={setProfileOpen} />
      <Hero onStartChat={handleStartChat} />
      {showChat && <ChatInterface />}
    </main>
  );
};

export default Index;
