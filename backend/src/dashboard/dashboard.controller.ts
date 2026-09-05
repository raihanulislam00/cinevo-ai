import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { success } from '../common/api-response.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthenticatedUser } from '../auth/dto/auth.dto.js';
import { DashboardService } from './dashboard.service.js';
@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController { constructor(@Inject(DashboardService) private readonly service: DashboardService) {} @Get() get(@CurrentUser() user: AuthenticatedUser) { return success(this.service.get(user.id)); } }
