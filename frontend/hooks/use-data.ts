"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; import { authService } from "@/services/auth.service"; import { dashboardService } from "@/services/dashboard.service"; import { videoService } from "@/services/video.service"; import { aiService } from "@/services/ai.service"; import type { VideoPlan } from "@/types";
export function useCurrentUser() { return useQuery({ queryKey: ["me"], queryFn: authService.me, retry: false }); }
export function useDashboard() { return useQuery({ queryKey: ["dashboard"], queryFn: dashboardService.get }); }
export function useVideos(params: { search?: string; status?: string } = {}) { return useQuery({ queryKey: ["videos", params], queryFn: () => videoService.list(params) }); }
export function useVideo(id: string) { return useQuery({ queryKey: ["video", id], queryFn: () => videoService.get(id), enabled: Boolean(id) }); }
export function useVideoStatus(id: string, enabled = true) { return useQuery({ queryKey: ["video-status", id], queryFn: () => videoService.status(id), enabled: Boolean(id) && enabled, refetchInterval: (query) => ["Pending", "Processing"].includes(query.state.data?.status ?? "") ? 3000 : false }); }
export function useLogin() { const client = useQueryClient(); return useMutation({ mutationFn: authService.login, onSuccess: (data) => { client.setQueryData(["me"], data.user); } }); }
export function useRegister() { return useMutation({ mutationFn: authService.register }); }
export function useCreateVideo() { const client = useQueryClient(); return useMutation({ mutationFn: videoService.create, onSuccess: () => { void client.invalidateQueries({ queryKey: ["videos"] }); void client.invalidateQueries({ queryKey: ["dashboard"] }); } }); }
export function useSendMessage() { return useMutation({ mutationFn: aiService.chat }); }
export function useCreateImage() { return useMutation({ mutationFn: aiService.image }); }
export function useDeleteVideo() { const client = useQueryClient(); return useMutation({ mutationFn: videoService.remove, onSuccess: () => { void client.invalidateQueries({ queryKey: ["videos"] }); void client.invalidateQueries({ queryKey: ["dashboard"] }); } }); }
export function starterPlan(): VideoPlan { return { title: "", targetAudience: "", duration: 60, platform: "YouTube Shorts", style: "Cinematic", hook: "", scenes: [{ sceneNumber: 1, duration: 5, visualPrompt: "", narration: "", textOverlay: "" }] }; }