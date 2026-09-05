import { Body, Controller, Delete, Get, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { success } from '../common/api-response.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthenticatedUser } from '../auth/dto/auth.dto.js';
import { CreateVideoDto, ListVideosDto } from './dto/video.dto.js';
import { VideosService } from './videos.service.js';
import { Throttle } from '@nestjs/throttler';
@ApiTags('Videos') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('videos')
export class VideosController {
  constructor(@Inject(VideosService) private readonly service: VideosService) {}
  @Post() @Throttle({ default: { limit: 5, ttl: 60_000 } }) create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateVideoDto) { return success(this.service.create(user.id, dto), 'Video queued for generation'); }
  @Get() list(@CurrentUser() user: AuthenticatedUser, @Query() dto: ListVideosDto) { return success(this.service.list(user.id, dto)); }
  @Get(':id') get(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return success(this.service.get(user.id, id)); }
  @Get(':id/status') status(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return success(this.service.status(user.id, id)); }
  @Delete(':id') async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { await this.service.remove(user.id, id); return success(null, 'Video deleted'); }
  @Post(':id/cancel') cancel(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) { return success(this.service.cancel(user.id, id), 'Video cancelled'); }
}
