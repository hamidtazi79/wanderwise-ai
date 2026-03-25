'use client';

import { useState, useRef, useEffect } from 'react';
import { getInstantAIChatSupport } from '@/ai/flows/get-instant-ai-chat-support';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bot, Loader2, Send, User, TriangleAlert, UserPlus } from 'lucide-react';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, increment, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { marked } from 'marked';
import { Logo } from '@/components/logo';
import { useRouter } from 'next/navigation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const FREE_CHAT_LIMIT = 1;

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userProfileRef);

  const isSubscribed = userProfile?.subscriptionStatus !== 'free';
  const chatLimit = userProfile?.chatMessagesSent || 0;
  const isChatDisabled = !isSubscribed && chatLimit >= FREE_CHAT_LIMIT;
  const isGuest = !user;

  useEffect(() => {
    // Add an initial greeting from the assistant
    setMessages([
        { role: 'assistant', content: "Hello! I'm your Wanderwise AI assistant. How can I help you plan your travels today?" }
    ]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // Use a slight delay to ensure the new message is rendered before scrolling
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }, 100);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      router.push('/signup');
      return;
    }
    if (!input.trim() || isLoading || isChatDisabled || !userProfileRef) return;

    const userMessage: Message = { role: 'user', content: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      if (!isSubscribed) {
        // Increment usage for free users
        await updateDoc(userProfileRef, {
            chatMessagesSent: increment(1)
        });
      }

      const response = await getInstantAIChatSupport({
        query: input,
        history: messages, // Pass previous messages for context
      });
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBottomBar = () => {
    if (isUserLoading) return null;

    if (isGuest) {
       return (
        <div className="text-center text-sm text-muted-foreground bg-muted p-4 rounded-lg">
            <UserPlus className="mx-auto mb-2 h-6 w-6 text-primary" />
            <h3 className="font-semibold text-foreground">Sign Up to Use AI Chat</h3>
            <p>Create a free account to get travel advice from our AI assistant.</p>
            <Button asChild size="sm" className="mt-3">
                <Link href="/signup">Create an Account</Link>
            </Button>
        </div>
      )
    }

    if (isChatDisabled) {
        return (
            <div className="text-center text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                <TriangleAlert className="mx-auto mb-2 h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">Free Chat Limit Reached</h3>
                <p>You&apos;ve used your {FREE_CHAT_LIMIT} free message.</p>
                <Button asChild size="sm" className="mt-3">
                    <Link href="/pricing">Upgrade for Unlimited Chat</Link>
                </Button>
            </div>
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about destinations, travel tips, or bookings..."
                    disabled={isLoading}
                    autoComplete="off"
                    className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                    <Send size={18} />
                    <span className="sr-only">Send Message</span>
                </Button>
            </form>
             {user && !isSubscribed && (
                <p className="mt-2 text-xs text-muted-foreground text-center">
                    Free Plan: {chatLimit}/{FREE_CHAT_LIMIT} message used. <Link href="/pricing" className="underline hover:text-primary">Upgrade</Link> for unlimited access.
                </p>
            )}
        </>
    )
  }

  return (
    <div className="flex flex-col h-full bg-card">
        <header className="flex items-center justify-between p-4 border-b">
            <Logo showText={true} />
        </header>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-4',
                message.role === 'user' ? 'justify-end' : ''
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={18} />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xl rounded-lg px-4 py-3 shadow-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                 {message.role === 'assistant' ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(message.content) as string }}
                  />
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback>
                    <User size={18} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={18} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-2 rounded-lg bg-muted px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background/50 p-4">
        {renderBottomBar()}
      </div>
    </div>
  );
}
