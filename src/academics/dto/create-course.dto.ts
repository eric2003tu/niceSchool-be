import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  credits?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  semester?: string;
}
