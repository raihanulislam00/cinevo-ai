export type VideoStatus = "Pending" | "Processing" | "Completed" | "Failed" | "Cancelled";
export interface User { id: string; name: string; email: string; }
export interface AuthSession { accessToken: string; refreshToken: string; user: User; }
export interface VideoScene { id?: string; sceneNumber: number; duration: number; visualPrompt: string; narration: string; textOverlay?: string; }
export interface VideoPlan { title: string; targetAudience: string; duration: number; platform: string; style: string; hook: string; scenes: VideoScene[]; }
export interface Video { id: string; title: string; description?: string | null; status: VideoStatus; videoPlan: VideoPlan; outputUrl?: string | null; createdAt: string; updatedAt: string; scenes?: VideoScene[]; jobs?: VideoJob[]; }
export interface VideoJob { id: string; status: VideoStatus; progress: number; errorMessage?: string | null; provider: string; }
export interface Dashboard { statistics: { totalVideos: number; completedVideos: number; processingVideos: number; failedVideos: number }; recentVideos: Array<Pick<Video, "id" | "title" | "status" | "createdAt"> & { outputUrl?: string | null }>; }
export interface Conversation { id: string; title: string; createdAt: string; updatedAt: string; messages?: ChatMessage[]; }
export interface ChatMessage { id?: string; role: "User" | "Gemini"; content: string; createdAt?: string; }
export interface ApiEnvelope<T> { success: boolean; message: string; data: T; }
export interface PaginatedVideos { items: Video[]; page: number; pageSize: number; total: number; totalPages: number; }