import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterEventDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}