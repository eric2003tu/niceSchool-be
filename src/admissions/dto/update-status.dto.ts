import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../../common/enums/application-status.enum';

export class UpdateStatusDto {
  @ApiProperty({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}