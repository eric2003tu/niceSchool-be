import { IsString, IsDateString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  courseId: string;

  @ApiProperty()
  @IsDateString()
  examDate: string;

  @ApiProperty()
  @IsInt()
  durationMin: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  totalMarks?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  examType?: string;
}
