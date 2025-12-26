import { IsString, IsOptional, IsObject, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class PersonalInfoDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  dateOfBirth: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  nationality: string;
}

class AcademicInfoDto {
  @ApiProperty()
  @IsString()
  previousEducation: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(4)
  gpa: number;

  @ApiProperty()
  @IsNumber()
  graduationYear: number;

  @ApiProperty()
  @IsString()
  institution: string;
}

class DocumentsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transcript?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  recommendationLetter?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  personalStatement?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  idDocument?: string;
}

class RefDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

export class CreateApplicationDto {
  // Accept either direct id strings or nested objects from frontend components
  @ApiProperty({ description: 'Program id (select from existing programs)', required: false })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiProperty({ description: 'Department id (program must belong to this department)', required: false })
  @IsOptional()
  @IsString()
  departmentId?: string;


  @ApiProperty({ required: false, description: 'Optional program object { id }' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RefDto)
  program?: RefDto;

  @ApiProperty({ required: false, description: 'Optional department object { id }' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RefDto)
  department?: RefDto;


  @ApiProperty()
  @IsString()
  academicYear: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => AcademicInfoDto)
  academicInfo: AcademicInfoDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DocumentsDto)
  documents?: DocumentsDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  personalStatement?: string;
}