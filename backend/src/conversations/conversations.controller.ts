import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { success } from '../common/api-response.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthenticatedUser } from '../auth/dto/auth.dto.js';
import { CreateConversationDto } from './dto/conversation.dto.js';
import { ConversationsService } from './conversations.service.js';
@ApiTags('Conversations') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('conversations')
export class ConversationsController {
  constructor(@Inject(ConversationsService) private readonly service: ConversationsService) {}
  @Get() list(@CurrentUser() user: AuthenticatedUser) { return success(this.service.list(user.id)); }
  @Post() create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateConversationDto) { return success(this.service.create(user.id, dto.title), 'Conversation created'); }
  @Get(':id') get(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return success(this.service.get(user.id, id)); }
  @Delete(':id') async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { await this.service.remove(user.id, id); return success(null, 'Conversation deleted'); }
}
