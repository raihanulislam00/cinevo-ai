import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { GeminiService } from '../gemini/gemini.service.js';
import { ChatDto } from '../conversations/dto/conversation.dto.js';
@Injectable()
export class AiService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(GeminiService) private readonly gemini: GeminiService) {}
  async chat(userId: string, dto: ChatDto) {
    let conversation = dto.conversationId ? await this.prisma.conversation.findFirst({ where: { id: dto.conversationId, userId } }) : null;
    if (dto.conversationId && !conversation) throw new NotFoundException('Conversation not found');
    conversation ??= await this.prisma.conversation.create({ data: { userId, title: dto.message.slice(0, 80) } });
    const reply = await this.gemini.chat(dto.message);
    await this.prisma.chatMessage.createMany({ data: [{ conversationId: conversation.id, role: 'User', content: dto.message }, { conversationId: conversation.id, role: 'Gemini', content: reply }] });
    return { conversationId: conversation.id, message: reply };
  }
}
