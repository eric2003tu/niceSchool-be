
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { $Enums } from '@prisma/client';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    let prismaRole: $Enums.UserRole = $Enums.UserRole.STUDENT;
    if (createUserDto.role && Object.values($Enums.UserRole).includes(createUserDto.role as $Enums.UserRole)) {
      prismaRole = createUserDto.role as $Enums.UserRole;
    }
    try {
      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          role: prismaRole,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        // Prisma unique constraint violation
        throw new ConflictException('User with this email already exists');
      }
      // Log error for debugging
      console.error('User creation error:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        profileImage: true,
      },
    });
  }

  async findOne(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
        phone: true,
        dateOfBirth: true,
        isActive: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<any | undefined> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    let prismaRole: $Enums.UserRole | undefined = undefined;
    if (updateUserDto.role && Object.values($Enums.UserRole).includes(updateUserDto.role as $Enums.UserRole)) {
      prismaRole = updateUserDto.role as $Enums.UserRole;
    }
    const updateData: any = { ...updateUserDto };
    if (prismaRole) {
      updateData.role = prismaRole;
    }
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }
}