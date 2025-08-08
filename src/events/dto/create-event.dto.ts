import { IsString, IsDateString, IsOptional, IsBoolean, IsNumber, Min, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ default: 'general' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isRegistrationOpen?: boolean;

  @ApiProperty({ default: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  maxAttendees?: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}