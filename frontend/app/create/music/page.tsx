"use client";

import { Loader2, Music2, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function CreateMusicPage() {
  const [prompt, setPrompt] = useState("");
  const [mood, setMood] = useState("Hopeful");
  const [duration, setDuration] = useState("30 seconds");
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);

  function createMusic() {
    if (!prompt.trim()) return;
    setIsCreating(true);
    setCreated(false);
    window.setTimeout(() => { setIsCreating(false); setCreated(true); }, 700);
  }

  return <AppShell><div className="mb-8"><p className="flex items-center gap-2 text-sm font-semibold text-[#0d8478]"><Sparkles className="h-4 w-4" /> Creative studio</p><h1 className="display mt-2 text-4xl font-bold text-[#173b39]">Create music</h1><p className="mt-2 text-[#7b8983]">Find the rhythm that gives your story its pulse.</p></div><div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]"><section className="rounded-3xl bg-[#173b39] p-6 text-white shadow-xl shadow-[#173b39]/10"><div className="flex items-center gap-3"><span className="rounded-xl bg-white/10 p-2"><Music2 className="h-5 w-5 text-[#f5aa8e]" /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#92d5c1]">Music studio</p><h2 className="display text-2xl font-bold">Set the mood.</h2></div></div><label className="mt-8 block text-sm font-semibold text-white/80">Describe your track<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={7} placeholder="Warm acoustic guitar with a gentle build..." className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/35 focus:border-[#92d5c1]" /></label><button disabled={!prompt.trim() || isCreating} onClick={createMusic} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ee7967] py-3.5 text-sm font-bold transition hover:bg-[#f18b79] disabled:opacity-40">{isCreating && <Loader2 className="h-4 w-4 animate-spin" />} {isCreating ? "Creating track..." : "Create music"}</button></section><section className="rounded-3xl border border-[#e4e8e3] bg-white p-6"><div className="flex items-center justify-between border-b border-[#edf0ec] pb-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#ee7967]">Working canvas</p><h2 className="display mt-1 text-2xl font-bold text-[#173b39]">Music settings</h2></div><Music2 className="h-5 w-5 text-[#0d8478]" /></div><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field label="Mood"><select value={mood} onChange={(event) => setMood(event.target.value)} className="input"><option>Hopeful</option><option>Energetic</option><option>Dreamy</option><option>Focused</option><option>Emotional</option></select></Field><Field label="Length"><select value={duration} onChange={(event) => setDuration(event.target.value)} className="input"><option>15 seconds</option><option>30 seconds</option><option>60 seconds</option><option>90 seconds</option></select></Field></div><div className="mt-6 rounded-2xl bg-[#eaf4ef] p-5">{created ? <div className="flex items-center gap-4"><button aria-label="Play generated music" className="rounded-full bg-[#173b39] p-3 text-white"><Play className="h-4 w-4 fill-current" /></button><div><p className="font-semibold text-[#173b39]">Your track is ready to review.</p><p className="mt-1 text-sm text-[#71807a]">{mood} · {duration}</p></div></div> : <div className="flex items-center gap-4 text-[#71807a]"><Music2 className="h-8 w-8 text-[#0d8478]" /><p className="text-sm leading-6">Your generated track and playback controls will appear here.</p></div>}</div></section></div></AppShell>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="text-xs font-bold text-[#71807a]">{label}<div className="mt-1">{children}</div></label>; }