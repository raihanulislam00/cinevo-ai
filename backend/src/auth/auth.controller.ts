import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { success } from '../common/api-response.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto, RefreshDto, RegisterDto } from './dto/auth.dto.js';
import type { AuthenticatedUser } from './dto/auth.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly service: AuthService) {}
  @Post('register') async register(@Body() dto: RegisterDto) { return success(await this.service.register(dto), 'Registration successful'); }
  @Post('login') @Throttle({ default: { limit: 10, ttl: 60_000 } }) async login(@Body() dto: LoginDto) { return success(await this.service.login(dto), 'Login successful'); }
  @Post('refresh') async refresh(@Body() dto: RefreshDto) { return success(await this.service.refresh(dto.refreshToken)); }
  @Post('logout') async logout(@Body() dto: RefreshDto) { await this.service.logout(dto.refreshToken); return success(null, 'Logout successful'); }
  @Get('me') @ApiBearerAuth() @UseGuards(JwtAuthGuard) async me(@CurrentUser() user: AuthenticatedUser) { return success(await this.service.getCurrentUser(user.id)); }
}
