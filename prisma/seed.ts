import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@niceschool.edu';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        firstName: 'Site',
        lastName: 'Admin',
        role: 'ADMIN',
      },
    });
    // eslint-disable-next-line no-console
    console.log('Seeded admin user:', adminEmail);
  } else {
    // eslint-disable-next-line no-console
    console.log('Admin user already exists:', adminEmail);
  }

  // Seed a sample department, program, course, cohort and faculty
  const dept = await prisma.department.upsert({
    where: { code: 'CS' },
    update: {},
    create: {
      name: 'Computer Science & IT',
      code: 'CS',
      description: 'Department of Computer Science and Information Technology',
    },
  });

  const facultyEmail = process.env.SEED_FACULTY_EMAIL || 'sarah.williams@niceschool.edu';
  let faculty = await prisma.faculty.findUnique({ where: { email: facultyEmail } });
  if (!faculty) {
    faculty = await prisma.faculty.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: facultyEmail,
        department: 'Computer Science',
        position: 'Head of Department',
      },
    });
  }

  const program = await prisma.program.upsert({
    where: { code: 'BSCS' },
    update: {},
    create: {
      name: 'Bachelor of Science in Computer Science',
      code: 'BSCS',
      level: 'UNDERGRAD',
      departmentId: dept.id,
      durationYears: 4,
    },
  });

  const course = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      code: 'CS101',
      title: 'Introduction to Programming',
      credits: 3,
      departmentId: dept.id,
      programId: program.id,
    },
  });

  const existingCohort = await prisma.cohort.findFirst({ where: { name: 'CS-2025' } });
  if (!existingCohort) {
    await prisma.cohort.create({
      data: {
        name: 'CS-2025',
        programId: program.id,
        intakeYear: 2025,
      },
    });
  }
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
