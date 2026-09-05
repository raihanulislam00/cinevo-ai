import { Module } from '@nestjs/common';
import { GeminiModule } from '../gemini/gemini.module.js';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
@Module({ imports: [GeminiModule], controllers: [AiController], providers: [AiService] })
export class AiModule {}
