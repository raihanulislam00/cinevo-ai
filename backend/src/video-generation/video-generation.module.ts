import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { MockVideoGenerationService } from './mock-video-generation.service.js';
import { VideoGenerationProcessor } from './video-generation.processor.js';
import { VideoGateway } from './video.gateway.js';
@Module({ imports: [BullModule.forRootAsync({ inject: [ConfigService], useFactory: (config: ConfigService) => ({ connection: { host: config.get('REDIS_HOST', 'localhost'), port: config.get<number>('REDIS_PORT', 6379), password: config.get<string>('REDIS_PASSWORD') || undefined } }) }), BullModule.registerQueue({ name: 'video-generation', defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 1000 }, removeOnComplete: 100, removeOnFail: 100 } })], providers: [MockVideoGenerationService, VideoGenerationProcessor, VideoGateway], exports: [BullModule, MockVideoGenerationService] })
export class VideoGenerationModule {}
