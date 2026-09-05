import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { AxiosError } from 'axios';
import { VideoPlan } from './gemini.types.js';
import { videoAnalysisPrompt } from './prompts/video-analysis.prompt.js';
import { videoPlanPrompt } from './prompts/video-plan.prompt.js';

@Injectable()
export class GeminiService {
  constructor(@Inject(HttpService) private readonly http: HttpService, @Inject(ConfigService) private readonly config: ConfigService) {}
  private async ask(prompt: string): Promise<string> {
    const key = this.config.get<string>('GEMINI_API_KEY');
    if (!key) return 'Gemini is not configured. Add GEMINI_API_KEY to enable AI responses.';
    const model = this.config.get<string>('GEMINI_MODEL', 'gemini-2.5-flash');
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    try {
      const response = await firstValueFrom(this.http.post(endpoint, { contents: [{ parts: [{ text: prompt }] }] }));
      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text !== 'string' || !text.trim()) throw new Error('Gemini returned no text content');
      return text;
    } catch (error) {
      const providerError = error as AxiosError<{ error?: { message?: string } }>;
      const providerMessage = providerError.response?.data?.error?.message ?? (error instanceof Error ? error.message : 'Unknown provider error');
      console.error({ provider: 'gemini', model, status: providerError.response?.status, message: providerMessage });
      throw new BadGatewayException('Gemini request failed');
    }
  }
  chat(message: string) { return this.ask(videoAnalysisPrompt(message)); }
  async createPlan(message: string): Promise<VideoPlan> {
    const raw = await this.ask(videoPlanPrompt(message));
    try { const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, '')); this.validatePlan(parsed); return parsed as VideoPlan; } catch { throw new BadGatewayException('Gemini returned an invalid video plan'); }
  }
  private validatePlan(value: unknown): asserts value is VideoPlan {
    const plan = value as Partial<VideoPlan>;
    if (!plan || typeof plan.title !== 'string' || typeof plan.description !== 'string' || !Array.isArray(plan.scenes) || typeof plan.duration !== 'number' || !plan.music || !Array.isArray(plan.keywords) || !Array.isArray(plan.hashtags)) throw new Error('Invalid plan');
    for (const scene of plan.scenes) if (typeof scene.sceneNumber !== 'number' || typeof scene.duration !== 'number' || typeof scene.visualPrompt !== 'string' || typeof scene.narration !== 'string') throw new Error('Invalid scene');
  }
}
