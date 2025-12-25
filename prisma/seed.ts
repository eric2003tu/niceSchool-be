
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@niceschool.edu';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!';

  // Check for existing admin account
  let adminAccount = await prisma.account.findUnique({ where: { email: adminEmail } });
  if (!adminAccount) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    adminAccount = await prisma.account.create({
      data: {
        email: adminEmail,
        passwordHash: hashed,
        role: 'ADMIN',
        status: 'ACTIVE',
        profile: {
          create: {
            firstName: 'Site',
            lastName: 'Admin',
            displayName: 'Site Admin',
          },
        },
      },
      include: { profile: true },
    });
    console.log('Seeded admin account:', adminEmail);
  } else {
    console.log('Admin account already exists:', adminEmail);
  }

  // --- Seed Departments ---
  const departmentsData = [
    { code: 'CS', name: 'Computer Science & IT', description: 'Department of Computer Science and Information Technology' },
    { code: 'MATH', name: 'Mathematics', description: 'Department of Mathematics' },
    { code: 'ENG', name: 'English', description: 'Department of English Language and Literature' },
  ];
  const departments: Record<string, Awaited<ReturnType<typeof prisma.department.upsert>>> = {};
  for (const dept of departmentsData) {
    departments[dept.code] = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
  }
  console.log('Seeded departments:', Object.keys(departments));

  // --- Seed Programs ---
  const programsData = [
    { code: 'BSCS', name: 'BSc Computer Science', level: 'UNDERGRADUATE', department: 'CS', careerPaths: ['Software Engineer', 'Data Scientist'] },
    { code: 'BSMATH', name: 'BSc Mathematics', level: 'UNDERGRADUATE', department: 'MATH', careerPaths: ['Mathematician', 'Data Analyst'] },
    { code: 'BAENG', name: 'BA English', level: 'UNDERGRADUATE', department: 'ENG', careerPaths: ['Writer', 'Editor'] },
  ];
  const programs: Record<string, Awaited<ReturnType<typeof prisma.program.upsert>>> = {};
  for (const prog of programsData) {
    programs[prog.code] = await prisma.program.upsert({
      where: { code: prog.code },
      update: {},
      create: {
        code: prog.code,
        name: prog.name,
        // Use enum value for level
        level: 'UNDERGRADUATE',
        department: { connect: { id: departments[prog.department].id } },
        careerPaths: prog.careerPaths,
      },
    });
  }
  console.log('Seeded programs:', Object.keys(programs));

  // --- Seed Courses ---
  const coursesData = [
    { code: 'CS101', title: 'Intro to Programming', department: 'CS', programs: ['BSCS'], credits: 3 },
    { code: 'CS201', title: 'Data Structures', department: 'CS', programs: ['BSCS'], credits: 3 },
    { code: 'MATH101', title: 'Calculus I', department: 'MATH', programs: ['BSMATH', 'BSCS'], credits: 4 },
    { code: 'ENG101', title: 'English Composition', department: 'ENG', programs: ['BAENG', 'BSCS'], credits: 2 },
  ];
  const courses: Record<string, Awaited<ReturnType<typeof prisma.course.upsert>>> = {};
  for (const course of coursesData) {
    courses[course.code] = await prisma.course.upsert({
      where: { code: course.code },
      update: {},
      create: {
        code: course.code,
        title: course.title,
        credits: course.credits,
        department: { connect: { id: departments[course.department].id } },
        programs: { connect: course.programs.map(code => ({ id: programs[code].id })) },
      },
    });
  }
  console.log('Seeded courses:', Object.keys(courses));

  // --- Seed Cohorts ---
  const cohortsData = [
    { name: 'CS-2025', code: 'CS2025', program: 'BSCS', intakeYear: 2025, intakeSemester: 'FALL', startDate: new Date('2025-09-01'), endDate: new Date('2029-06-30') },
    { name: 'MATH-2025', code: 'MATH2025', program: 'BSMATH', intakeYear: 2025, intakeSemester: 'FALL', startDate: new Date('2025-09-01'), endDate: new Date('2029-06-30') },
    { name: 'ENG-2025', code: 'ENG2025', program: 'BAENG', intakeYear: 2025, intakeSemester: 'FALL', startDate: new Date('2025-09-01'), endDate: new Date('2029-06-30') },
  ];
  const cohorts: Record<string, Awaited<ReturnType<typeof prisma.cohort.upsert>>> = {};
  for (const cohort of cohortsData) {
    cohorts[cohort.code] = await prisma.cohort.upsert({
      where: { code: cohort.code },
      update: {},
      create: {
        name: cohort.name,
        code: cohort.code,
        program: { connect: { id: programs[cohort.program].id } },
        intakeYear: cohort.intakeYear,
        intakeSemester: cohort.intakeSemester,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
      },
    });
  }
  console.log('Seeded cohorts:', Object.keys(cohorts));

  // --- Seed Students (with Account/Profile) ---
  const studentsData = [
    { email: 'alice.student@niceschool.edu', firstName: 'Alice', lastName: 'Johnson', program: 'BSCS', cohort: 'CS2025', studentNumber: 'S1001' },
    { email: 'bob.student@niceschool.edu', firstName: 'Bob', lastName: 'Smith', program: 'BSMATH', cohort: 'MATH2025', studentNumber: 'S1002' },
    { email: 'carol.student@niceschool.edu', firstName: 'Carol', lastName: 'Lee', program: 'BAENG', cohort: 'ENG2025', studentNumber: 'S1003' },
  ];
  const students: Record<string, Awaited<ReturnType<typeof prisma.student.create>>> = {};
  for (const s of studentsData) {
    let account = await prisma.account.findUnique({ where: { email: s.email }, include: { profile: true } });
    if (!account) {
      await prisma.account.create({
        data: {
          email: s.email,
          passwordHash: await bcrypt.hash('StudentPass123!', 10),
          role: 'STUDENT',
          status: 'ACTIVE',
          profile: {
            create: {
              firstName: s.firstName,
              lastName: s.lastName,
              displayName: `${s.firstName} ${s.lastName}`,
            },
          },
        },
      });
      account = await prisma.account.findUnique({ where: { email: s.email }, include: { profile: true } });
    }
    const profileId = account?.profileId || account?.profile?.id;
    if (!profileId) throw new Error(`No profileId for student ${s.email}`);
    let student = await prisma.student.findFirst({ where: { profileId } });
    if (!student) {
      student = await prisma.student.create({
        data: {
          profile: { connect: { id: profileId } },
          studentNumber: s.studentNumber,
          enrollmentDate: new Date('2025-09-01'),
          program: { connect: { id: programs[s.program].id } },
          cohort: { connect: { id: cohorts[s.cohort].id } },
        },
      });
      console.log('Seeded student:', s.email);
    } else {
      console.log('Student already exists:', s.email);
    }
    students[s.email] = student;
  }

  // --- Seed Enrollments ---
  for (const s of studentsData) {
    const student = students[s.email];
    for (const courseCode of Object.keys(courses)) {
      // Enroll each student in all courses of their program
      if (coursesData.find(c => c.code === courseCode && c.programs.includes(s.program))) {
        const existing = await prisma.enrollment.findFirst({ where: { studentId: student.id, courseId: courses[courseCode].id } });
        if (!existing) {
          await prisma.enrollment.create({
            data: {
              student: { connect: { id: student.id } },
              course: { connect: { id: courses[courseCode].id } },
              status: 'REGISTERED',
              enrolledAt: new Date('2025-09-01'),
              semester: 'FALL',
            },
          });
          console.log(`Enrolled ${s.email} in ${courseCode}`);
        }
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
