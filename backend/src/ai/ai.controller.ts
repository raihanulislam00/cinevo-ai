import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/dto/auth.dto.js';
import { ChatDto } from '../conversations/dto/conversation.dto.js';
import { AiService } from './ai.service.js';
import { success } from '../common/api-response.js';
import { Throttle } from '@nestjs/throttler';
@ApiTags('AI') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('ai')
export class AiController { constructor(@Inject(AiService) private readonly service: AiService) {} @Post('chat') @Throttle({ default: { limit: 10, ttl: 60_000 } }) chat(@CurrentUser() user: AuthenticatedUser, @Body() dto: ChatDto) { return success(this.service.chat(user.id, dto)); } }
