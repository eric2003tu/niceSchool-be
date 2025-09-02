import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateStudentAndEnrollDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ required: false, example: '2005-05-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ required: false, example: 18 })
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiProperty({ required: false, description: 'Optional cohort id to enroll into' })
  @IsOptional()
  @IsString()
  cohortId?: string;
}
