'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AskAITabProps {
    meeting: {
        id: string;
        name: string;
    };
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const AskAITab = ({ meeting }: AskAITabProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Function to format AI response content
    const formatMessageContent = (content: string) => {
        // Split content into lines and process each line
        const lines = content.split('\n');
        const formattedLines = lines.map((line, index) => {
            // Handle bold text
            if (line.includes('**')) {
                const parts = line.split('**');
                return (
                    <div key={index} className="mb-3 break-words">
                        {parts.map((part, partIndex) => 
                            partIndex % 2 === 1 ? (
                                <strong key={partIndex} className="font-semibold text-foreground">{part}</strong>
                            ) : (
                                <span key={partIndex}>{part}</span>
                            )
                        )}
                    </div>
                );
            }
            
            // Handle bullet points
            if (line.trim().startsWith('- ')) {
                return (
                    <div key={index} className="ml-4 mb-2 flex items-start">
                        <span className="text-primary mr-3 mt-0.5 font-bold flex-shrink-0">•</span>
                        <span className="flex-1 break-words">{line.trim().substring(2)}</span>
                    </div>
                );
            }
            
            // Handle numbered lists
            if (/^\d+\.\s/.test(line.trim())) {
                return (
                    <div key={index} className="ml-4 mb-2 flex items-start">
                        <span className="text-primary mr-3 mt-0.5 font-semibold min-w-[1.5rem] flex-shrink-0">
                            {line.trim().match(/^\d+/)?.[0]}.
                        </span>
                        <span className="flex-1 break-words">{line.trim().replace(/^\d+\.\s/, '')}</span>
                    </div>
                );
            }
            
            // Handle timestamps
            if (line.includes('(') && line.includes(')') && /\d{2}:\d{2}/.test(line)) {
                return (
                    <div key={index} className="mb-2 break-words">
                        {line.split(/(\(\d{2}:\d{2}[^)]*\))/).map((part, partIndex) => 
                            /\d{2}:\d{2}/.test(part) ? (
                                <span key={partIndex} className="text-blue-600 font-mono text-xs bg-blue-100 px-2 py-1 rounded-md border inline-block">
                                    {part}
                                </span>
                            ) : (
                                <span key={partIndex}>{part}</span>
                            )
                        )}
                    </div>
                );
            }
            
            // Regular text
            if (line.trim()) {
                return (
                    <div key={index} className="mb-2 break-words">
                        {line}
                    </div>
                );
            }
            
            // Empty lines for spacing
            return <div key={index} className="mb-1"></div>;
        });
        
        return formattedLines;
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            console.log('Calling Ask AI API with:', { meetingId: meeting.id, question: currentInput });
            
            // Call the Ask AI API
            const response = await fetch('/api/meetings/ask-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    meetingId: meeting.id,
                    question: currentInput
                })
            });

            console.log('Ask AI Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Ask AI Error Response:', errorText);
                throw new Error(`Failed to get AI response: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Ask AI Response data:', result);
            
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.success ? result.response : `Error: ${result.error || 'Failed to get response'}`,
                timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error getting AI response:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Sorry, I encountered an error while processing your question: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="space-y-6 py-6">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Ask AI About This Meeting</h2>
            </div>

            <Card className="h-[600px] flex flex-col">
                <CardContent className="flex-1 flex flex-col p-0">
                    {/* Messages Area */}
                    <ScrollArea className="flex-1 p-6" style={{ maxHeight: '500px' }}>
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center max-w-md">
                                    <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Ask me anything about this meeting</h3>
                                    <p className="text-muted-foreground text-sm">
                                        I can help you understand the meeting content, find specific information, or answer questions about what was discussed.
                                    </p>
                                    <div className="mt-6 space-y-2">
                                        <p className="text-sm font-medium">Try asking:</p>
                                        <div className="space-y-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-left justify-start"
                                                onClick={() => setInput("What were the main topics discussed?")}
                                            >
                                                What were the main topics discussed?
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-left justify-start"
                                                onClick={() => setInput("Can you summarize the key points?")}
                                            >
                                                Can you summarize the key points?
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-left justify-start"
                                                onClick={() => setInput("What action items were mentioned?")}
                                            >
                                                What action items were mentioned?
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg px-4 py-3 break-words ${
                                                message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted border'
                                            }`}
                                        >
                                            {message.role === 'assistant' ? (
                                                <div className="text-sm leading-relaxed overflow-hidden">
                                                    {formatMessageContent(message.content)}
                                                </div>
                                            ) : (
                                                <p className="text-sm break-words">{message.content}</p>
                                            )}
                                            <p className="text-xs opacity-70 mt-1">
                                                {message.timestamp.toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted rounded-lg px-4 py-3">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="border-t p-4">
                        <div className="flex gap-2">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask a question about this meeting..."
                                className="min-h-[60px] max-h-[120px] resize-none"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                size="icon"
                                className="h-[60px] w-[60px] shrink-0"
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
