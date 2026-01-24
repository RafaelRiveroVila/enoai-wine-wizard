import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, Wine, User, Paperclip, X, FileText, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { streamWineChat } from "@/lib/wineChat";
import { useLanguage } from "@/contexts/LanguageContext";
import WineRecommendationDisplay, { parseWineRecommendation } from "./WineRecommendationDisplay";
import MarkdownContent from "./MarkdownContent";

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
  const { t, language } = useLanguage();
  
  const getWelcomeMessage = () => t.welcomeMessage;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: getWelcomeMessage(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [pendingResponse, setPendingResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevMessageCountRef = useRef(1);

  // Update welcome message when language changes (without triggering scroll)
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "assistant") {
        return [{ role: "assistant", content: getWelcomeMessage() }];
      }
      return prev;
    });
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: getWelcomeMessage(),
      },
    ]);
    setInput("");
    setAttachments([]);
    setPendingResponse("");
    prevMessageCountRef.current = 1;
  };

  // Only scroll when new messages are added, not when content is updated
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      scrollToBottom();
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

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
        toast.error(t.onlyImagesAndPdfs);
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

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessage: Message = { 
      role: "user", 
      content: input || t.analyzePrompt,
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    const currentAttachments = [...attachments];
    setAttachments([]);
    setIsLoading(true);

    try {
      // Convert attachments to base64 for API
      const fileData: { data: string; type: string; mimeType: string }[] = [];
      
      for (const attachment of currentAttachments) {
        if (attachment.type === "image" && attachment.preview) {
          fileData.push({
            data: attachment.preview,
            type: "image",
            mimeType: attachment.file.type
          });
        } else if (attachment.type === "pdf") {
          // Read PDF as base64
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(attachment.file);
          });
          fileData.push({
            data: base64,
            type: "pdf",
            mimeType: "application/pdf"
          });
        }
      }

      let assistantContent = "";
      
      // Build messages history for context
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      messageHistory.push({
        role: "user",
        content: currentInput || t.analyzePrompt
      });

      await streamWineChat({
        messages: messageHistory,
        fileData: fileData.length > 0 ? fileData : undefined,
        onDelta: (chunk) => {
          assistantContent += chunk;
          setPendingResponse(assistantContent);
        },
        onDone: () => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: assistantContent }
          ]);
          setPendingResponse("");
          setIsLoading(false);
        },
        onError: (error) => {
          console.error("Chat error:", error);
          toast.error(`Error: ${error}`);
          setIsLoading(false);
          setPendingResponse("");
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t.errorSending);
      setIsLoading(false);
      setPendingResponse("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
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
            <h2 className="text-3xl font-bold">{t.chatTitle}</h2>
          </div>
          <p className="text-muted-foreground">
            {t.chatSubtitle}
          </p>
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="mt-4 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.newChat}
            </Button>
          )}
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
                  {message.role === "assistant" && parseWineRecommendation(message.content) ? (
                    <WineRecommendationDisplay data={parseWineRecommendation(message.content)!} />
                  ) : (
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground border border-border"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <MarkdownContent content={message.content} className="text-foreground" />
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  )}
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
                  <Wine className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted text-foreground rounded-2xl px-4 py-3 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-sm text-muted-foreground">{t.findingWines}</span>
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
              onKeyDown={handleKeyDown}
              placeholder={t.chatPlaceholder}
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
