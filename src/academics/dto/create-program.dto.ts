import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ enum: ['UNDERGRAD','POSTGRAD','DIPLOMA','CERTIFICATE'] })
  @IsString()
  level: string;

  @ApiProperty()
  @IsString()
  departmentId: string;

  @ApiProperty()
  @IsInt()
  durationYears: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
