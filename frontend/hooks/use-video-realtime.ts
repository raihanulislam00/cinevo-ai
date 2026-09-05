"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import type { VideoStatus } from "@/types";

interface VideoEvent { videoId: string; status?: VideoStatus; progress?: number; }

export function useVideoRealtime(videoId: string) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!videoId) return;
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:9000", { transports: ["websocket"], autoConnect: true });
    const refresh = (event: VideoEvent) => { if (event.videoId === videoId) { void queryClient.invalidateQueries({ queryKey: ["video", videoId] }); void queryClient.invalidateQueries({ queryKey: ["video-status", videoId] }); } };
    socket.on("video:processing", refresh); socket.on("video:progress", refresh); socket.on("video:completed", refresh); socket.on("video:failed", refresh);
    return () => { socket.off("video:processing", refresh); socket.off("video:progress", refresh); socket.off("video:completed", refresh); socket.off("video:failed", refresh); socket.disconnect(); };
  }, [videoId, queryClient]);
}