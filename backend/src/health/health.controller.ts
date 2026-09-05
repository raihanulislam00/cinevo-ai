import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service.js';
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  @Get() async check() {
    let database = 'connected';
    try { await this.prisma.$queryRaw`SELECT 1`; } catch { database = 'disconnected'; }
    return { status: database === 'connected' ? 'ok' : 'degraded', database, redis: process.env.REDIS_HOST ? 'configured' : 'not-configured' };
  }
}
