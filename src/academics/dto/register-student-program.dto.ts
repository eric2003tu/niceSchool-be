import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsInt, IsEmail } from 'class-validator';

export class RegisterStudentInProgramDto {
  @ApiProperty({ example: 'student@email.com', description: 'Student email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'BSCS', description: 'Program code the student is admitted in' })
  @IsString()
  @IsNotEmpty()
  programCode: string;

  @ApiProperty({ example: 'CS2025', description: 'Cohort code for the program' })
  @IsString()
  @IsNotEmpty()
  cohortCode: string;

  @ApiProperty({ example: 'Jane', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: false, example: '2005-05-01', description: 'Date of birth' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ required: false, example: 'F', description: 'Gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ required: false, example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: '123 Main St, City', description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;
}
