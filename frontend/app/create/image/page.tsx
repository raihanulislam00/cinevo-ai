"use client";

import { Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { apiError } from "@/services/api";
import { useCreateImage } from "@/hooks/use-data";
import { toast } from "sonner";

export default function CreateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [isCreating, setIsCreating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const image = useCreateImage();

  async function createImage() {
    if (!prompt.trim()) return;
    setIsCreating(true);
    setImageUrl(undefined);
    try {
      const result = await image.mutateAsync({ prompt: prompt.trim(), style, aspectRatio });
      setImageUrl(result.imageUrl);
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setIsCreating(false);
    }
  }

  return <AppShell><Header title="Create image" description="Turn a visual idea into a frame for your next story." /><div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]"><section className="rounded-3xl bg-[#173b39] p-6 text-white shadow-xl shadow-[#173b39]/10"><div className="flex items-center gap-3"><span className="rounded-xl bg-white/10 p-2"><ImageIcon className="h-5 w-5 text-[#f5aa8e]" /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#92d5c1]">Image studio</p><h2 className="display text-2xl font-bold">Set the scene.</h2></div></div><label className="mt-8 block text-sm font-semibold text-white/80">Describe your image<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={7} placeholder="A sunlit creative studio above the city..." className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/35 focus:border-[#92d5c1]" /></label><button disabled={!prompt.trim() || isCreating} onClick={() => void createImage()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ee7967] py-3.5 text-sm font-bold transition hover:bg-[#f18b79] disabled:opacity-40">{isCreating && <Loader2 className="h-4 w-4 animate-spin" />} {isCreating ? "Creating image..." : "Create image"}</button></section><section className="rounded-3xl border border-[#e4e8e3] bg-white p-6"><div className="flex items-center justify-between border-b border-[#edf0ec] pb-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#ee7967]">Working canvas</p><h2 className="display mt-1 text-2xl font-bold text-[#173b39]">Image settings</h2></div><Sparkles className="h-5 w-5 text-[#0d8478]" /></div><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field label="Style"><select value={style} onChange={(event) => setStyle(event.target.value)} className="input"><option>Cinematic</option><option>Editorial</option><option>Illustration</option><option>Photorealistic</option></select></Field><Field label="Aspect ratio"><select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value)} className="input"><option>16:9</option><option>1:1</option><option>4:5</option><option>9:16</option></select></Field></div><div className="mt-6 flex min-h-72 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#cfdcd5] bg-[#f7f8f5] p-8 text-center">{imageUrl ? <img src={imageUrl} alt={prompt} className="max-h-112 w-full rounded-xl object-contain" /> : <p className="max-w-xs text-sm leading-6 text-[#89958f]">Your generated image will appear here.</p>}</div></section></div></AppShell>;
}

function Header({ title, description }: { title: string; description: string }) { return <div className="mb-8"><p className="flex items-center gap-2 text-sm font-semibold text-[#0d8478]"><Sparkles className="h-4 w-4" /> Creative studio</p><h1 className="display mt-2 text-4xl font-bold text-[#173b39]">{title}</h1><p className="mt-2 text-[#7b8983]">{description}</p></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="text-xs font-bold text-[#71807a]">{label}<div className="mt-1">{children}</div></label>; }