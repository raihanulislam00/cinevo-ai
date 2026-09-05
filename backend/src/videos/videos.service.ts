import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVideoDto, ListVideosDto } from './dto/video.dto.js';
@Injectable()
export class VideosService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @InjectQueue('video-generation') private readonly queue: Queue) {}
  async create(userId: string, dto: CreateVideoDto) {
    if (dto.conversationId) { const conversation = await this.prisma.conversation.findFirst({ where: { id: dto.conversationId, userId } }); if (!conversation) throw new NotFoundException('Conversation not found'); }
    const video = await this.prisma.video.create({ data: { userId, conversationId: dto.conversationId, title: dto.title, description: dto.description, videoPlan: dto.videoPlan as Prisma.InputJsonValue, scenes: { create: Array.isArray(dto.videoPlan.scenes) ? dto.videoPlan.scenes.map((scene, index) => { const value = scene as Record<string, unknown>; return { sceneNumber: Number(value.sceneNumber ?? index + 1), duration: Number(value.duration ?? 1), visualPrompt: String(value.visualPrompt ?? ''), narration: String(value.narration ?? ''), textOverlay: value.textOverlay ? String(value.textOverlay) : undefined }; }) : [] } } });
    const generationJob = await this.prisma.videoGenerationJob.create({ data: { videoId: video.id, provider: process.env.VIDEO_PROVIDER ?? 'mock' } });
    await this.queue.add('generate-video', { videoId: video.id }, { jobId: generationJob.id });
    return { ...video, jobId: generationJob.id };
  }
  async list(userId: string, dto: ListVideosDto) { const where = { userId, ...(dto.status ? { status: dto.status } : {}), ...(dto.search ? { title: { contains: dto.search, mode: 'insensitive' as const } } : {}) }; const [items, total] = await Promise.all([this.prisma.video.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (dto.page - 1) * dto.pageSize, take: dto.pageSize }), this.prisma.video.count({ where })]); return { items, page: dto.page, pageSize: dto.pageSize, total, totalPages: Math.ceil(total / dto.pageSize) }; }
  async get(userId: string, id: string) { const video = await this.prisma.video.findFirst({ where: { id, userId }, include: { scenes: true, jobs: { orderBy: { createdAt: 'desc' }, take: 1 } } }); if (!video) throw new NotFoundException('Video not found'); return video; }
  async status(userId: string, id: string) { const video = await this.get(userId, id); return { videoId: video.id, status: video.status, job: video.jobs[0] ?? null }; }
  async remove(userId: string, id: string) { const result = await this.prisma.video.deleteMany({ where: { id, userId } }); if (!result.count) throw new NotFoundException('Video not found'); }
  async cancel(userId: string, id: string) { const video = await this.prisma.video.findFirst({ where: { id, userId } }); if (!video) throw new NotFoundException('Video not found'); await this.prisma.video.update({ where: { id }, data: { status: 'Cancelled' } }); return { videoId: id, status: 'Cancelled' }; }
}
