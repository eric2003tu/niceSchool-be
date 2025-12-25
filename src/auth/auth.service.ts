import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ContactService } from '../contact/contact.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
    private contactService: ContactService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const account = await this.usersService.findByEmail(email, true);
    if (account && await bcrypt.compare(password, account.passwordHash)) {
      // Flatten profile fields
      const { passwordHash: _, profile, ...rest } = account;
      return {
        ...rest,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        profileImage: profile?.avatarUrl,
        dateOfBirth: profile?.dateOfBirth,
      };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== 'ACTIVE') throw new UnauthorizedException('Account is deactivated');

    await this.usersService.updateLastLogin(user.id);

    const payload = { email: user.email, sub: user.id, userId: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '600m',
      }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        status: user.status,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email, true);
    if (existingUser) throw new UnauthorizedException('User already exists');

    const user = await this.usersService.create(registerDto);
    // Fetch the created user with profile
    const fullUser = await this.usersService.findByEmail(user.email, true);
    const { passwordHash: _, profile, ...rest } = fullUser;
    const flatUser = {
      ...rest,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      profileImage: profile?.avatarUrl,
      dateOfBirth: profile?.dateOfBirth,
    };

    const payload = { 
      email: flatUser.email, 
      sub: flatUser.id,
      userId: flatUser.id,
      role: flatUser.role,
      phone: flatUser.phone,
      profileImage: flatUser.profileImage,
      dateOfBirth: flatUser.dateOfBirth,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME || '15m',
      }),
      user: flatUser,
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { success: true };

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.prisma.passwordResetToken.create({
      data: { accountId: user.id, token, expiresAt },
    });

    const resetBase = this.configService.get('FRONTEND_URL') || this.configService.get('APP_URL') || '';
    const resetLink = `${resetBase}/reset-password?token=${token}`;

    try {
      await this.contactService.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to: user.email,
        subject: 'Password reset request',
        html: `<p>Hi ${user.firstName || ''},</p><p>Use the link below to reset your password. The link expires in 1 hour.</p><p><a href="${resetLink}">Reset password</a></p>`,
      });
    } catch (err) {
      console.error('Failed to send password reset email', err);
    }

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record) throw new BadRequestException('Invalid or expired token');
    if (record.expiresAt < new Date()) {
      await this.prisma.passwordResetToken.delete({ where: { id: record.id } });
      throw new BadRequestException('Invalid or expired token');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: record.accountId }, data: { password: hashed } });

    await this.prisma.passwordResetToken.delete({ where: { id: record.id } });
    return { success: true };
  }
}
