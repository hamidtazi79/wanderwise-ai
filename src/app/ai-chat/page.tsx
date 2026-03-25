import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Travel Chat – Wanderwise AI",
  description:
    "Chat with Wanderwise AI to get personalized travel answers, tips, and recommendations instantly.",
  alternates: {
    canonical: "/ai-chat",
  },
};
import { ChatInterface } from './chat-interface';

export default function AiChatPage() {
  return (
    <div className="h-full">
      <ChatInterface />
    </div>
  );
}
