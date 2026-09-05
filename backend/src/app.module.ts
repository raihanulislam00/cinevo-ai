import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { ConversationsModule } from './conversations/conversations.module.js';
import { VideosModule } from './videos/videos.module.js';
import { AiModule } from './ai/ai.module.js';
import { GeminiModule } from './gemini/gemini.module.js';
import { VideoGenerationModule } from './video-generation/video-generation.module.js';
import { StorageModule } from './storage/storage.module.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    DashboardModule,
    HealthModule,
    ConversationsModule,
    VideosModule,
    AiModule,
    GeminiModule,
    VideoGenerationModule,
    StorageModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
