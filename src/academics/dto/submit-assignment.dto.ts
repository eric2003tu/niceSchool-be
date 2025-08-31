import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAssignmentDto {
  @ApiProperty()
  @IsString()
  assignmentId: string;

  @ApiProperty()
  @IsString()
  studentId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  submissionText?: string;
}
