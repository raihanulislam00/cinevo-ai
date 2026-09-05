import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { IVideoGenerationService, VideoGenerationRequest, VideoGenerationResult, VideoGenerationStatus } from './video-generation.types.js';
@Injectable()
export class MockVideoGenerationService implements IVideoGenerationService {
  private readonly jobs = new Map<string, VideoGenerationStatus>();
  async generate(request: VideoGenerationRequest, onProgress?: (progress: number) => Promise<void>): Promise<VideoGenerationResult> {
    const providerJobId = randomUUID(); this.jobs.set(providerJobId, { providerJobId, progress: 0, status: 'Processing' });
    for (let progress = 0; progress <= 100; progress += 10) { await new Promise((resolve) => setTimeout(resolve, 100)); const status = progress === 100 ? 'Completed' : 'Processing'; this.jobs.set(providerJobId, { providerJobId, progress, status }); await onProgress?.(progress); }
    return { providerJobId, outputPath: `videos/${request.videoId}/sample.mp4` };
  }
  async getStatus(providerJobId: string) { return this.jobs.get(providerJobId) ?? { providerJobId, progress: 0, status: 'Failed' as const }; }
  async cancel(providerJobId: string) { const job = this.jobs.get(providerJobId); if (job) this.jobs.set(providerJobId, { ...job, status: 'Cancelled' }); }
}
