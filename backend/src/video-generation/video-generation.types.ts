export interface VideoGenerationRequest { videoId: string; plan: unknown; }
export interface VideoGenerationResult { providerJobId: string; outputPath: string; }
export interface VideoGenerationStatus { providerJobId: string; progress: number; status: 'Processing' | 'Completed' | 'Failed' | 'Cancelled'; }
export interface IVideoGenerationService { generate(request: VideoGenerationRequest, onProgress?: (progress: number) => Promise<void>): Promise<VideoGenerationResult>; getStatus(providerJobId: string): Promise<VideoGenerationStatus>; cancel(providerJobId: string): Promise<void>; }
