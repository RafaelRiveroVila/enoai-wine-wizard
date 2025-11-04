import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Wine, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm enoAI, your wine sommelier assistant. I can help you choose the perfect wine for any occasion. What would you like to know about wine today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (replace with actual AI integration later)
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! For a Cabernet Sauvignon, I'd recommend pairing it with a hearty steak or aged cheese. The bold tannins complement rich, fatty foods beautifully.",
        "Excellent choice! A Pinot Noir would be perfect for that occasion. Look for bottles from Burgundy or Oregon for classic expressions, or try New Zealand for a fruit-forward style.",
        "For your budget, I'd suggest exploring wines from lesser-known regions. Portuguese Douro reds and Spanish Ribera del Duero offer incredible value and complexity.",
        "White wine for seafood is a classic pairing! I'd recommend a crisp Albariño or a rich Chardonnay depending on the preparation. For lighter fish, go with the Albariño.",
        "Sweet wines can be wonderful! Consider a late-harvest Riesling or a Sauternes for dessert. They pair beautifully with fruit-based desserts and soft cheeses.",
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: randomResponse },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Wine className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Chat with enoAI</h2>
          </div>
          <p className="text-muted-foreground">
            Ask me anything about wine selection, pairings, or recommendations
          </p>
        </div>

        {/* Chat Messages */}
        <Card className="mb-6 p-6 min-h-[500px] max-h-[600px] overflow-y-auto shadow-lg">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-500`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Wine className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground border border-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-in fade-in">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Wine className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted text-foreground rounded-2xl px-4 py-3 border border-border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Input Area */}
        <Card className="p-4 shadow-lg">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about wine pairings, recommendations, or any wine-related questions..."
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              variant="hero"
              className="h-[60px] w-[60px] flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ChatInterface;
