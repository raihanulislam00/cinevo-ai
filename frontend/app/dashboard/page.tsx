"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, Film, Loader2, Plus, TrendingUp, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { VideoCard } from "@/components/videos/video-card";
import { useCurrentUser, useDashboard } from "@/hooks/use-data";

const emptyStats = { totalVideos: 0, completedVideos: 0, processingVideos: 0, failedVideos: 0 };

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  const { data, isLoading, isError, refetch } = useDashboard();
  const stats = data?.statistics ?? emptyStats;
  const metrics = [
    { label: "Total videos", value: stats.totalVideos, icon: Film, color: "bg-[#e4f1eb] text-[#0d8478]" },
    { label: "Completed", value: stats.completedVideos, icon: TrendingUp, color: "bg-[#fff0e9] text-[#ee7967]" },
    { label: "Processing", value: stats.processingVideos, icon: Clock3, color: "bg-[#fff3d9] text-[#b2761b]" },
    { label: "Needs attention", value: stats.failedVideos, icon: XCircle, color: "bg-[#ffe8e3] text-[#c65c4e]" },
  ];

  return <AppShell>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold text-[#0d8478]">Good to see you, {user?.name?.split(" ")[0] || "creator"}.</p><h1 className="display mt-2 text-4xl font-bold text-[#173b39] sm:text-5xl">Make something worth watching.</h1><p className="mt-3 text-[#7b8983]">Your ideas, your studio, one calm creative flow.</p></div>
      <Link href="/create" className="rounded-full bg-[#ee7967] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ee7967]/15"><Plus className="mr-1 inline h-4 w-4" /> New video</Link>
    </div>
    {isError ? <State title="We couldn't load your studio." action="Try again" onAction={() => void refetch()} /> : <>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl border border-[#e4e8e3] bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-[#7d8985]">{label}</span><span className={`rounded-xl p-2 ${color}`}><Icon className="h-4 w-4" /></span></div><p className="display mt-6 text-4xl font-bold text-[#173b39]">{isLoading ? <Loader2 className="h-7 w-7 animate-spin text-[#cbd7d1]" /> : value}</p></div>)}</div>
      <section className="mt-12"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#ee7967]">Your library</p><h2 className="display mt-1 text-2xl font-bold text-[#173b39]">Recent videos</h2></div><Link href="/videos" className="text-sm font-bold text-[#0d8478]">View all <ArrowUpRight className="ml-1 inline h-4 w-4" /></Link></div>{isLoading ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><Skeleton /><Skeleton /><Skeleton /></div> : data?.recentVideos?.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{data.recentVideos.slice(0, 3).map((video) => <VideoCard key={video.id} video={video as never} />)}</div> : <State title="No videos yet" description="Your first video is only one idea away." action="Create your first video" href="/create" />}</section>
    </>}
  </AppShell>;
}

function Skeleton() { return <div className="animate-pulse overflow-hidden rounded-2xl border border-[#e4e8e3] bg-white"><div className="aspect-[1.45] bg-[#e7eeea]" /><div className="space-y-3 p-5"><div className="h-4 w-1/3 rounded bg-[#e7eeea]" /><div className="h-6 w-3/4 rounded bg-[#e7eeea]" /></div></div>; }
function State({ title, description, action, href, onAction }: { title: string; description?: string; action: string; href?: string; onAction?: () => void }) { return <div className="rounded-2xl border border-dashed border-[#cfdcd5] bg-white p-12 text-center"><h3 className="display text-2xl font-bold text-[#173b39]">{title}</h3>{description && <p className="mt-2 text-sm text-[#7d8985]">{description}</p>}{href ? <Link href={href} className="mt-6 inline-block rounded-full bg-[#173b39] px-5 py-3 text-sm font-bold text-white">{action}</Link> : <button onClick={onAction} className="mt-6 rounded-full bg-[#173b39] px-5 py-3 text-sm font-bold text-white">{action}</button>}</div>; }
