"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { loadProfile } from "@/lib/profile";
import { UserProfile, ChatMessage } from "@/lib/types";
import Nav from "@/components/nav";
import { ArrowUp, Loader2 } from "lucide-react";

const STARTER_PROMPTS = [
  "What careers match my interests?",
  "I'm not sure what I want to do yet",
  "What skills should I start building now?",
  "Compare a few career paths for me",
];

export default function MentorPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      router.replace("/onboarding");
      return;
    }
    setProfile(p);
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !profile || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, profile }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Sorry, I had trouble responding. Can you try again? Make sure the `claude` CLI is installed and logged in on this machine.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto pt-4 md:pt-20 pb-36">
        {/* Welcome / empty state */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-8 animate-float-up">
            <p className="label-caps text-[#1e9fc4]">Your Mentor</p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
              Hello, <span className="italic">{profile.name}.</span>
              <br />
              Let&apos;s find your path.
            </h2>
            <p className="text-sm text-[#0e3a47]/60 max-w-md leading-relaxed">
              I know you&apos;re drawn to{" "}
              {profile.interests.slice(0, 3).join(", ").toLowerCase()} and your
              goal is to {profile.primaryGoal.toLowerCase()}. Ask me anything.
            </p>
            <div className="flex flex-wrap justify-center gap-3 w-full max-w-lg">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="label-caps px-5 py-3 rounded-full border border-[#0e3a47]/25 bg-white/60 text-[#0e3a47] hover:border-[#0e3a47] transition-all duration-300 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex-1 px-4 space-y-5 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex animate-float-up ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-3xl rounded-br-lg bg-[#0e3a47] text-white whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] md:max-w-[80%] space-y-1.5">
                    <p className="label-caps text-[#1e9fc4] pl-5">Mentor</p>
                    <div className="px-5 py-4 rounded-3xl rounded-bl-lg bg-white/80 backdrop-blur-sm border border-[#3cbbde]/20 text-[#0e3a47] whitespace-pre-wrap text-sm leading-relaxed shadow-[0_4px_24px_rgba(60,187,222,0.08)]">
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-5 py-4 rounded-3xl rounded-bl-lg bg-white/80 border border-[#3cbbde]/20">
                  <Loader2 className="w-5 h-5 text-[#1e9fc4] animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* Input */}
      <div className="fixed bottom-14 md:bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-[#3cbbde]/20 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="max-w-3xl mx-auto flex items-end gap-3"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask your mentor anything..."
            rows={1}
            className="flex-1 px-5 py-3.5 rounded-full border border-[#0e3a47]/20 bg-white resize-none focus:outline-none focus:border-[#1e9fc4] text-sm placeholder:text-[#0e3a47]/40 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-[#0e3a47] text-white p-3.5 rounded-full hover:bg-[#1e9fc4] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer shrink-0"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
