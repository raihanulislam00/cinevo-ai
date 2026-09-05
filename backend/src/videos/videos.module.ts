import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { VideoGenerationModule } from '../video-generation/video-generation.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { VideosController } from './videos.controller.js';
import { VideosService } from './videos.service.js';
@Module({ imports: [PrismaModule, BullModule.registerQueue({ name: 'video-generation' }), VideoGenerationModule], controllers: [VideosController], providers: [VideosService] })
export class VideosModule {}
