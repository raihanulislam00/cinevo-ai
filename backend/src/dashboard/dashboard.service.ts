import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
@Injectable()
export class DashboardService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  async get(userId: string) {
    const [totalVideos, completedVideos, processingVideos, failedVideos, recentVideos] = await Promise.all([
      this.prisma.video.count({ where: { userId } }),
      this.prisma.video.count({ where: { userId, status: 'Completed' } }),
      this.prisma.video.count({ where: { userId, status: 'Processing' } }),
      this.prisma.video.count({ where: { userId, status: 'Failed' } }),
      this.prisma.video.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, title: true, status: true, outputUrl: true, createdAt: true } }),
    ]);
    return { statistics: { totalVideos, completedVideos, processingVideos, failedVideos }, recentVideos };
  }
}
