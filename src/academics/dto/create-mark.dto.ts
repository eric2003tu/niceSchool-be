import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarkDto {
  @ApiProperty()
  @IsString()
  examId: string;

  @ApiProperty()
  @IsString()
  studentId: string;

  @ApiProperty()
  @IsInt()
  marks: number;

  @ApiProperty({ required: false })
  @IsString()
  grade?: string;

  @ApiProperty({ required: false })
  @IsString()
  remarks?: string;
}
