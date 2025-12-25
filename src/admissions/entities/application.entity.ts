import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApplicationStatus } from '../../common/enums/application-status.enum';
// Use Prisma types from @prisma/client

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

// Use Prisma types from @prisma/client

  @Column()
  applicantId: string;

  @Column()
  program: string;

  @Column()
  academicYear: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.DRAFT,
  })
  status: ApplicationStatus;

  @Column({ type: 'json', nullable: true })
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    nationality: string;
  };

  @Column({ type: 'json', nullable: true })
  academicInfo: {
    previousEducation: string;
    gpa: number;
    graduationYear: number;
    institution: string;
  };

  @Column({ type: 'json', nullable: true })
  documents: {
    transcript: string;
    recommendationLetter: string;
    personalStatement: string;
    idDocument: string;
  };

  @Column({ type: 'text', nullable: true })
  personalStatement: string;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}