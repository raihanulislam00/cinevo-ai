import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/dto/auth.dto.js';
import { ChatDto } from '../conversations/dto/conversation.dto.js';
import { AiService } from './ai.service.js';
import { success } from '../common/api-response.js';
import { Throttle } from '@nestjs/throttler';
class ImageDto { @IsString() @IsNotEmpty() @MaxLength(4_000) prompt!: string; @IsString() @IsNotEmpty() style!: string; @IsIn(['16:9', '1:1', '4:5', '9:16']) aspectRatio!: string; }
@ApiTags('AI') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('ai')
export class AiController { constructor(@Inject(AiService) private readonly service: AiService) {} @Post('chat') @Throttle({ default: { limit: 10, ttl: 60_000 } }) async chat(@CurrentUser() user: AuthenticatedUser, @Body() dto: ChatDto) { return success(await this.service.chat(user.id, dto)); } @Post('image') @Throttle({ default: { limit: 3, ttl: 60_000 } }) async image(@Body() dto: ImageDto) { return success(await this.service.image(dto)); } }
