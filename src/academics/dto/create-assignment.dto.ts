import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  courseId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  totalMarks?: number;
}
