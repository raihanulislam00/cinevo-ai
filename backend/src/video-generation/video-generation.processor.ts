import { Inject, Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service.js';
import { STORAGE_SERVICE } from '../storage/storage.module.js';
import type { IStorageService } from '../storage/storage.service.js';
import { VideoGateway } from './video.gateway.js';
import { MockVideoGenerationService } from './mock-video-generation.service.js';
@Processor('video-generation')
@Injectable()
export class VideoGenerationProcessor extends WorkerHost {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(MockVideoGenerationService) private readonly provider: MockVideoGenerationService, @Inject(VideoGateway) private readonly gateway: VideoGateway, @Inject(STORAGE_SERVICE) private readonly storage: IStorageService) { super(); }
  async process(job: Job<{ videoId: string }>) {
    const video = await this.prisma.video.findUniqueOrThrow({ where: { id: job.data.videoId } });
    const generationJob = await this.prisma.videoGenerationJob.findFirstOrThrow({ where: { videoId: video.id }, orderBy: { createdAt: 'desc' } });
    await this.prisma.video.update({ where: { id: video.id }, data: { status: 'Processing' } });
    await this.prisma.videoGenerationJob.update({ where: { id: generationJob.id }, data: { status: 'Processing', startedAt: new Date(), attempts: job.attemptsMade + 1 } });
    this.gateway.emit('video:processing', { videoId: video.id, status: 'Processing', progress: 0 });
    try {
      const result = await this.provider.generate({ videoId: video.id, plan: video.videoPlan }, async (progress) => { await this.prisma.videoGenerationJob.update({ where: { id: generationJob.id }, data: { progress } }); this.gateway.emit('video:progress', { videoId: video.id, status: 'Processing', progress }); });
      const outputUrl = await this.storage.getUrl(result.outputPath);
      await this.prisma.video.update({ where: { id: video.id }, data: { status: 'Completed', outputUrl } });
      await this.prisma.videoGenerationJob.update({ where: { id: generationJob.id }, data: { status: 'Completed', progress: 100, providerJobId: result.providerJobId, completedAt: new Date() } });
      this.gateway.emit('video:completed', { videoId: video.id, status: 'Completed', progress: 100, outputUrl });
      return result;
    } catch (error) { const message = error instanceof Error ? error.message : 'Generation failed'; await this.prisma.video.update({ where: { id: video.id }, data: { status: 'Failed' } }); await this.prisma.videoGenerationJob.update({ where: { id: generationJob.id }, data: { status: 'Failed', errorMessage: message } }); this.gateway.emit('video:failed', { videoId: video.id, status: 'Failed', errorMessage: message }); throw error; }
  }
}
