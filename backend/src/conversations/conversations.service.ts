import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
@Injectable()
export class ConversationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  list(userId: string) { return this.prisma.conversation.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }, include: { _count: { select: { messages: true } } } }); }
  create(userId: string, title: string) { return this.prisma.conversation.create({ data: { userId, title } }); }
  async get(userId: string, id: string) { const conversation = await this.prisma.conversation.findFirst({ where: { id, userId }, include: { messages: { orderBy: { createdAt: 'asc' } } } }); if (!conversation) throw new NotFoundException('Conversation not found'); return conversation; }
  async remove(userId: string, id: string) { const result = await this.prisma.conversation.deleteMany({ where: { id, userId } }); if (!result.count) throw new NotFoundException('Conversation not found'); }
}
