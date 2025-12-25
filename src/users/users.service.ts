
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role as AccountRole, AccountStatus } from '@prisma/client';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    let prismaRole: AccountRole = AccountRole.STUDENT;
    if (createUserDto.role && Object.values(AccountRole).includes(createUserDto.role as AccountRole)) {
      prismaRole = createUserDto.role as AccountRole;
    }
    try {
      return await this.prisma.account.create({
        data: {
          email: createUserDto.email,
          passwordHash: hashedPassword,
          role: prismaRole,
          status: AccountStatus.ACTIVE,
          profile: {
            create: {
              firstName: createUserDto.firstName,
              lastName: createUserDto.lastName,
              displayName: `${createUserDto.firstName} ${createUserDto.lastName}`,
              avatarUrl: createUserDto.profileImage,
              dateOfBirth: createUserDto.dateOfBirth,
            },
          },
          phone: createUserDto.phone,
        },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Account with this email already exists');
      }
      console.error('Account creation error:', error);
      throw new InternalServerErrorException('Failed to create account');
    }
  }

  async findAll(): Promise<any[]> {
    const accounts = await this.prisma.account.findMany({ include: { profile: true } });
    return accounts.map(({ passwordHash, profile, ...rest }) => ({
      ...rest,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      profileImage: profile?.avatarUrl,
      dateOfBirth: profile?.dateOfBirth,
    }));
  }

  async findOne(id: string): Promise<any> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const { passwordHash, profile, ...rest } = account;
    return {
      ...rest,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      profileImage: profile?.avatarUrl,
      dateOfBirth: profile?.dateOfBirth,
    };
  }

  async findByEmail(email: string, withProfile = false): Promise<any | undefined> {
    return this.prisma.account.findUnique({
      where: { email },
      include: withProfile ? { profile: true } : undefined,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    let prismaRole: AccountRole | undefined = undefined;
    if (updateUserDto.role && Object.values(AccountRole).includes(updateUserDto.role as AccountRole)) {
      prismaRole = updateUserDto.role as AccountRole;
    }
    const updateData: any = { ...updateUserDto };
    if (prismaRole) {
      updateData.role = prismaRole;
    }
    return this.prisma.account.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.account.delete({ where: { id } });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.account.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }
}