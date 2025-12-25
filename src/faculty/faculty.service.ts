
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';


@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFacultyDto: CreateFacultyDto): Promise<any> {
    // Map department to departmentId if needed
    const { department, ...rest } = createFacultyDto as any;
    const payload: any = { ...rest };
    if (department) payload.department = { connect: { id: department } };
    return this.prisma.faculty.create({ data: payload });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    department?: string,
    search?: string,
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const where: any = { isActive: true };
    if (department && department !== 'all') {
      where.departmentId = department;
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.faculty.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.faculty.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<any> {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
    });
    if (!faculty || !faculty.isActive) {
      throw new NotFoundException('Faculty member not found');
    }
    return faculty;
  }

  async findByDepartment(department: string): Promise<any[]> {
    return this.prisma.faculty.findMany({
      where: { departmentId: department, isActive: true },
    });
  }

  async update(id: string, updateFacultyDto: UpdateFacultyDto): Promise<any> {
    // Map department to departmentId if needed
    const { department, ...rest } = updateFacultyDto as any;
    const payload: any = { ...rest };
    if (department) payload.department = { connect: { id: department } };
    return this.prisma.faculty.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.faculty.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getDepartments(): Promise<string[]> {
    const departments = await this.prisma.faculty.findMany({
      where: { isActive: true },
      select: { departmentId: true },
      distinct: ['departmentId'],
    });
    return departments.map(dept => dept.departmentId);
  }
}