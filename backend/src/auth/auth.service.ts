import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';

@Injectable()
export class AuthService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(JwtService) private readonly jwt: JwtService, @Inject(ConfigService) private readonly config: ConfigService) {}
  private publicUser(user: { id: string; name: string; email: string }) { return { id: user.id, name: user.name, email: user.email }; }
  private hashToken(token: string) { return createHash('sha256').update(token).digest('hex'); }
  private async tokens(user: { id: string; email: string }) {
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email }, { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m') });
    const refreshToken = await this.jwt.signAsync({ sub: user.id, email: user.email, jti: randomUUID() }, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET'), expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '30d') });
    await this.prisma.refreshToken.create({ data: { userId: user.id, tokenHash: this.hashToken(refreshToken), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
    return { accessToken, refreshToken };
  }
  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (exists) throw new ConflictException('Email is already registered');
    const user = await this.prisma.user.create({ data: { name: dto.name, email: dto.email.toLowerCase(), passwordHash: await bcrypt.hash(dto.password, 12) } });
    return { userId: user.id, name: user.name, email: user.email };
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) throw new UnauthorizedException('Invalid credentials');
    return { ...(await this.tokens(user)), user: this.publicUser(user) };
  }
  async refresh(token: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; email: string }>(token, { secret: this.config.getOrThrow('JWT_REFRESH_SECRET') });
      const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash: this.hashToken(token) } });
      if (!stored || stored.expiresAt < new Date()) throw new UnauthorizedException('Invalid refresh token');
      await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      return this.tokens({ id: payload.sub, email: payload.email });
    } catch { throw new UnauthorizedException('Invalid refresh token'); }
  }
  async logout(token: string) { await this.prisma.refreshToken.deleteMany({ where: { tokenHash: this.hashToken(token) } }); }
  async getCurrentUser(id: string) { const user = await this.prisma.user.findUniqueOrThrow({ where: { id } }); return this.publicUser(user); }
}
