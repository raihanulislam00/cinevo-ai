import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeminiService } from './gemini.service.js';
@Module({ imports: [HttpModule.register({ timeout: 15_000, maxRedirects: 2 })], providers: [GeminiService], exports: [GeminiService] })
export class GeminiModule {}
