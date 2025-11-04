import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Wine, User, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface FileAttachment {
  file: File;
  preview?: string;
  type: "image" | "pdf";
}

interface Message {
  role: "user" | "assistant";
  content: string;
  attachments?: FileAttachment[];
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm enoAI, your wine sommelier assistant. I can help you choose the perfect wine for any occasion. You can also upload images of wine labels or PDF wine lists for recommendations. What would you like to know about wine today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments((prev) => [
            ...prev,
            {
              file,
              preview: e.target?.result as string,
              type: "image",
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setAttachments((prev) => [
          ...prev,
          {
            file,
            type: "pdf",
          },
        ]);
      } else {
        toast.error("Only images and PDF files are supported");
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const streamText = async (text: string) => {
    setStreamingContent("");
    const words = text.split(" ");
    
    for (let i = 0; i < words.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setStreamingContent((prev) => prev + (i > 0 ? " " : "") + words[i]);
    }
    
    return text;
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessage: Message = { 
      role: "user", 
      content: input,
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    // Simulate AI response with streaming
    const aiResponses = [
      "That's a great question! For a Cabernet Sauvignon, I'd recommend pairing it with a hearty steak or aged cheese. The bold tannins complement rich, fatty foods beautifully.",
      "Excellent choice! A Pinot Noir would be perfect for that occasion. Look for bottles from Burgundy or Oregon for classic expressions, or try New Zealand for a fruit-forward style.",
      "For your budget, I'd suggest exploring wines from lesser-known regions. Portuguese Douro reds and Spanish Ribera del Duero offer incredible value and complexity.",
      "White wine for seafood is a classic pairing! I'd recommend a crisp Albariño or a rich Chardonnay depending on the preparation. For lighter fish, go with the Albariño.",
      "I can see from your image that this is an excellent vintage! Let me help you understand the best food pairings and serving suggestions for this wine.",
      "Looking at this wine list, I notice several outstanding options. Based on your preferences, I'd recommend focusing on the Burgundy section for elegant Pinot Noirs.",
    ];
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    // Stream the response
    const streamedText = await streamText(randomResponse);
    
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: streamedText },
    ]);
    setStreamingContent("");
    setIsLoading(false);
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
                <div className="flex flex-col gap-2 max-w-[80%]">
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {message.attachments.map((attachment, attIndex) => (
                        <div
                          key={attIndex}
                          className="rounded-lg overflow-hidden border border-border bg-card"
                        >
                          {attachment.type === "image" && attachment.preview ? (
                            <img
                              src={attachment.preview}
                              alt="Uploaded wine label"
                              className="max-w-[200px] max-h-[200px] object-cover"
                            />
                          ) : (
                            <div className="px-3 py-2 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {attachment.file.name}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && streamingContent && (
              <div className="flex gap-3 justify-start animate-in fade-in">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Wine className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted text-foreground rounded-2xl px-4 py-3 border border-border max-w-[80%]">
                  <p className="text-sm leading-relaxed">{streamingContent}<span className="inline-block w-1 h-4 bg-primary ml-1 animate-pulse" /></p>
                </div>
              </div>
            )}
            {isLoading && !streamingContent && (
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
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border border-border bg-card"
                >
                  {attachment.type === "image" && attachment.preview ? (
                    <img
                      src={attachment.preview}
                      alt="Preview"
                      className="max-w-[100px] max-h-[100px] object-cover"
                    />
                  ) : (
                    <div className="px-3 py-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground max-w-[150px] truncate">
                        {attachment.file.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              size="icon"
              variant="outline"
              className="h-[60px] w-[60px] flex-shrink-0"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about wine pairings, recommendations, or upload images/PDFs..."
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && attachments.length === 0) || isLoading}
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
