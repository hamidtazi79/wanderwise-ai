'use client';

import { useState, useRef, useEffect } from 'react';
import { getInstantAIChatSupport } from '@/ai/flows/get-instant-ai-chat-support';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

import { cn } from '@/lib/utils';

import {
  Bot,
  Loader2,
  Send,
  User,
  TriangleAlert,
  UserPlus,
  Sparkles,
} from 'lucide-react';

import {
  useFirestore,
  useUser,
  useMemoFirebase,
} from '@/firebase/provider';

import { useDoc } from '@/firebase/firestore/use-doc';

import { doc, increment, updateDoc } from 'firebase/firestore';

import Link from 'next/link';

import { marked } from 'marked';

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

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;

    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userProfileRef);

  const isSubscribed = userProfile?.subscriptionStatus !== 'free';

  const chatLimit = userProfile?.chatMessagesSent || 0;

  const isChatDisabled =
    !isSubscribed && chatLimit >= FREE_CHAT_LIMIT;

  const isGuest = !user;

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hello 👋 I'm your Wanderwise AI travel assistant. Ask me about destinations, itineraries, budgets, food spots, hidden gems, or smarter ways to plan your trip.",
      },
    ]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        const viewport =
          scrollAreaRef.current?.querySelector(
            'div[data-radix-scroll-area-viewport]'
          );

        if (viewport) {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }, [messages]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (isGuest) return;

    if (
      !input.trim() ||
      isLoading ||
      isChatDisabled ||
      !userProfileRef
    )
      return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;

    setInput('');

    setIsLoading(true);

    try {
      if (!isSubscribed) {
        await updateDoc(userProfileRef, {
          chatMessagesSent: increment(1),
        });
      }

      const response = await getInstantAIChatSupport({
        query: currentInput,
        history: messages,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, something went wrong while generating your travel response.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBottomBar = () => {
    if (isUserLoading) return null;

    if (isGuest) {
      return (
        <div className="rounded-2xl border bg-slate-50 p-6 text-center">
          <UserPlus className="mx-auto h-7 w-7 text-sky-500" />

          <h3 className="mt-3 text-lg font-semibold">
            Create a free account
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to use the AI travel assistant and start planning smarter trips.
          </p>

          <Button asChild className="mt-5">
            <Link href="/signup">
              Create Account
            </Link>
          </Button>
        </div>
      );
    }

    if (isChatDisabled) {
      return (
        <div className="rounded-2xl border bg-slate-50 p-6 text-center">
          <TriangleAlert className="mx-auto h-7 w-7 text-amber-500" />

          <h3 className="mt-3 text-lg font-semibold">
            Free message limit reached
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Upgrade to Premium for unlimited AI travel chat and itinerary tools.
          </p>

          <Button asChild className="mt-5">
            <Link href="/pricing">
              Upgrade to Premium
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <>
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about destinations, budgets, itineraries, food, or travel ideas..."
            disabled={isLoading}
            autoComplete="off"
            className="h-12 rounded-xl"
          />

          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-12 w-12 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {user && !isSubscribed && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Free Plan: {chatLimit}/{FREE_CHAT_LIMIT} message used ·{' '}
            <Link
              href="/pricing"
              className="font-medium text-sky-600 hover:underline"
            >
              Upgrade for unlimited AI chat
            </Link>
          </p>
        )}
      </>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-white px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-5 w-5 text-sky-500" />
            Wanderwise AI Assistant
          </h2>

          <p className="text-sm text-muted-foreground">
            Personalized travel planning powered by AI
          </p>
        </div>
      </div>

      <ScrollArea
        className="flex-1 bg-slate-50"
        ref={scrollAreaRef}
      >
        <div className="space-y-6 p-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex gap-3',
                message.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback className="bg-sky-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm',
                  message.role === 'user'
                    ? 'bg-sky-500 text-white'
                    : 'border bg-white'
                )}
              >
                {message.role === 'assistant' ? (
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: marked(message.content) as string,
                    }}
                  />
                ) : (
                  <p>{message.content}</p>
                )}
              </div>

              {message.role === 'user' && (
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-9 w-9 border">
                <AvatarFallback className="bg-sky-500 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>

              <div className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-white p-4">
        {renderBottomBar()}
      </div>
    </div>
  );
}
