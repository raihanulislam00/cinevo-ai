"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUp, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useSendMessage } from "@/hooks/use-data";
import type { ChatMessage } from "@/types";
import { apiError } from "@/services/api";

export default function ChatPage() {
  const router = useRouter();
  const chat = useSendMessage();
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "Gemini", content: "Tell me what you want to make. A rough idea is more than enough to start." },
  ]);

  async function sendMessage() {
    if (!input.trim() || chat.isPending) return;
    const text = input.trim();
    setInput("");
    setMessages((current) => [...current, { role: "User", content: text }]);
    try {
      const response = await chat.mutateAsync({ message: text, conversationId });
      setConversationId(response.conversationId);
      setMessages((current) => [...current, { role: "Gemini", content: response.message }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "Gemini", content: apiError(error) }]);
    }
  }

  return (
    <AppShell>
      <div className="mb-8">
        <p className="flex items-center gap-2 text-sm font-semibold text-[#0d8478]"><Sparkles className="h-4 w-4" /> Creative studio</p>
        <h1 className="display mt-2 text-4xl font-bold text-[#173b39]">Let&apos;s find the story.</h1>
        <p className="mt-2 text-[#7b8983]">Talk through the idea first. Shape the plan when it feels ready.</p>
      </div>
      <section className="mx-auto flex min-h-170 max-w-3xl flex-col rounded-3xl border border-[#e4e8e3] bg-[#173b39] p-5 text-white shadow-xl shadow-[#173b39]/10">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#92d5c1]">AI video assistant</p><h2 className="display mt-1 text-2xl font-bold">Find the angle.</h2></div>
          <span className="rounded-xl bg-white/10 p-2"><WandSparkles className="h-5 w-5 text-[#f5aa8e]" /></span>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto py-6">
          {messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "User" ? "ml-8" : "mr-8"}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[.15em] text-white/40">{message.role === "User" ? "You" : "Cinevo AI"}</p>
            <div className={message.role === "User" ? "rounded-2xl rounded-tr-sm bg-[#ee7967] p-4 text-sm leading-6" : "rounded-2xl rounded-tl-sm bg-white/10 p-4 text-sm leading-6 text-white/85"}>{message.content}</div>
          </div>)}
          {chat.isPending && <div className="flex gap-1 px-3"><span className="h-2 w-2 animate-bounce rounded-full bg-[#92d5c1]" /><span className="h-2 w-2 animate-bounce rounded-full bg-[#92d5c1] [animation-delay:120ms]" /><span className="h-2 w-2 animate-bounce rounded-full bg-[#92d5c1] [animation-delay:240ms]" /></div>}
        </div>
        <div className="rounded-2xl bg-white/10 p-2">
          <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} rows={3} placeholder="Describe an idea, feeling, or question..." className="w-full resize-none bg-transparent p-3 text-sm text-white outline-none placeholder:text-white/35" />
          <div className="flex justify-end"><button disabled={!input.trim() || chat.isPending} onClick={() => void sendMessage()} aria-label="Send message" className="rounded-xl bg-[#ee7967] p-3 transition hover:bg-[#f18b79] disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button></div>
        </div>
        <button onClick={() => router.push("/create/plan")} className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 py-3 text-sm font-bold text-white transition hover:bg-white/15">Open video plan <ArrowRight className="h-4 w-4" /></button>
      </section>
    </AppShell>
  );
}
