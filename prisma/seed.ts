
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

  // --- Seed All Possible Departments ---
  const departmentsData = [
    { code: 'CS', name: 'Computer Science & IT', description: 'Department of Computer Science and Information Technology' },
    { code: 'MATH', name: 'Mathematics', description: 'Department of Mathematics' },
    { code: 'ENG', name: 'English', description: 'Department of English Language and Literature' },
    { code: 'BIO', name: 'Biology', description: 'Department of Biology' },
    { code: 'CHEM', name: 'Chemistry', description: 'Department of Chemistry' },
    { code: 'PHYS', name: 'Physics', description: 'Department of Physics' },
    { code: 'HIST', name: 'History', description: 'Department of History' },
    { code: 'ECON', name: 'Economics', description: 'Department of Economics' },
    { code: 'PSY', name: 'Psychology', description: 'Department of Psychology' },
    { code: 'ART', name: 'Art', description: 'Department of Art' },
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

  // --- Seed All Possible Programs in Each Department ---
  const programsData = [
    // CS
    { code: 'BSCS', name: 'BSc Computer Science', level: 'UNDERGRADUATE', department: 'CS', careerPaths: ['Software Engineer', 'Data Scientist'] },
    { code: 'MSCS', name: 'MSc Computer Science', level: 'POSTGRADUATE', department: 'CS', careerPaths: ['Researcher', 'Software Architect'] },
    // MATH
    { code: 'BSMATH', name: 'BSc Mathematics', level: 'UNDERGRADUATE', department: 'MATH', careerPaths: ['Mathematician', 'Data Analyst'] },
    { code: 'MSMATH', name: 'MSc Mathematics', level: 'POSTGRADUATE', department: 'MATH', careerPaths: ['Statistician', 'Professor'] },
    // ENG
    { code: 'BAENG', name: 'BA English', level: 'UNDERGRADUATE', department: 'ENG', careerPaths: ['Writer', 'Editor'] },
    { code: 'MAENG', name: 'MA English', level: 'POSTGRADUATE', department: 'ENG', careerPaths: ['Linguist', 'Literary Critic'] },
    // BIO
    { code: 'BSBIO', name: 'BSc Biology', level: 'UNDERGRADUATE', department: 'BIO', careerPaths: ['Biologist', 'Lab Technician'] },
    { code: 'MSBIO', name: 'MSc Biology', level: 'POSTGRADUATE', department: 'BIO', careerPaths: ['Research Scientist', 'Professor'] },
    // CHEM
    { code: 'BSCHEM', name: 'BSc Chemistry', level: 'UNDERGRADUATE', department: 'CHEM', careerPaths: ['Chemist', 'Lab Technician'] },
    { code: 'MSCHEM', name: 'MSc Chemistry', level: 'POSTGRADUATE', department: 'CHEM', careerPaths: ['Research Chemist', 'Professor'] },
    // PHYS
    { code: 'BSPHYS', name: 'BSc Physics', level: 'UNDERGRADUATE', department: 'PHYS', careerPaths: ['Physicist', 'Engineer'] },
    { code: 'MSPHYS', name: 'MSc Physics', level: 'POSTGRADUATE', department: 'PHYS', careerPaths: ['Research Physicist', 'Professor'] },
    // HIST
    { code: 'BAHIST', name: 'BA History', level: 'UNDERGRADUATE', department: 'HIST', careerPaths: ['Historian', 'Archivist'] },
    { code: 'MAHIST', name: 'MA History', level: 'POSTGRADUATE', department: 'HIST', careerPaths: ['Researcher', 'Professor'] },
    // ECON
    { code: 'BSECON', name: 'BSc Economics', level: 'UNDERGRADUATE', department: 'ECON', careerPaths: ['Economist', 'Analyst'] },
    { code: 'MSECON', name: 'MSc Economics', level: 'POSTGRADUATE', department: 'ECON', careerPaths: ['Researcher', 'Professor'] },
    // PSY
    { code: 'BSPSY', name: 'BSc Psychology', level: 'UNDERGRADUATE', department: 'PSY', careerPaths: ['Psychologist', 'Counselor'] },
    { code: 'MSPSY', name: 'MSc Psychology', level: 'POSTGRADUATE', department: 'PSY', careerPaths: ['Researcher', 'Professor'] },
    // ART
    { code: 'BAART', name: 'BA Art', level: 'UNDERGRADUATE', department: 'ART', careerPaths: ['Artist', 'Curator'] },
    { code: 'MAART', name: 'MA Art', level: 'POSTGRADUATE', department: 'ART', careerPaths: ['Art Historian', 'Professor'] },
  ];
  const programs: Record<string, Awaited<ReturnType<typeof prisma.program.upsert>>> = {};
  for (const prog of programsData) {
    programs[prog.code] = await prisma.program.upsert({
      where: { code: prog.code },
      update: {},
      create: {
        code: prog.code,
        name: prog.name,
        level: prog.level as any, // Cast to ProgramLevel enum
        department: { connect: { id: departments[prog.department].id } },
        careerPaths: prog.careerPaths,
      },
    });
  }
  console.log('Seeded programs:', Object.keys(programs));

  // --- Seed All Possible Courses in Each Program ---
  const coursesData = [
    // CS
    { code: 'CS101', title: 'Intro to Programming', department: 'CS', programs: ['BSCS', 'MSCS'], credits: 3 },
    { code: 'CS201', title: 'Data Structures', department: 'CS', programs: ['BSCS', 'MSCS'], credits: 3 },
    { code: 'CS301', title: 'Algorithms', department: 'CS', programs: ['BSCS', 'MSCS'], credits: 3 },
    { code: 'CS501', title: 'Advanced Topics in CS', department: 'CS', programs: ['MSCS'], credits: 3 },
    // MATH
    { code: 'MATH101', title: 'Calculus I', department: 'MATH', programs: ['BSMATH', 'BSCS', 'MSMATH'], credits: 4 },
    { code: 'MATH201', title: 'Linear Algebra', department: 'MATH', programs: ['BSMATH', 'MSMATH'], credits: 4 },
    { code: 'MATH501', title: 'Advanced Mathematics', department: 'MATH', programs: ['MSMATH'], credits: 4 },
    // ENG
    { code: 'ENG101', title: 'English Composition', department: 'ENG', programs: ['BAENG', 'BSCS', 'MAENG'], credits: 2 },
    { code: 'ENG201', title: 'Literary Analysis', department: 'ENG', programs: ['BAENG', 'MAENG'], credits: 2 },
    { code: 'ENG501', title: 'Advanced English Studies', department: 'ENG', programs: ['MAENG'], credits: 2 },
    // BIO
    { code: 'BIO101', title: 'General Biology', department: 'BIO', programs: ['BSBIO', 'MSBIO'], credits: 3 },
    { code: 'BIO501', title: 'Advanced Biology', department: 'BIO', programs: ['MSBIO'], credits: 3 },
    // CHEM
    { code: 'CHEM101', title: 'General Chemistry', department: 'CHEM', programs: ['BSCHEM', 'MSCHEM'], credits: 3 },
    { code: 'CHEM501', title: 'Advanced Chemistry', department: 'CHEM', programs: ['MSCHEM'], credits: 3 },
    // PHYS
    { code: 'PHYS101', title: 'General Physics', department: 'PHYS', programs: ['BSPHYS', 'MSPHYS'], credits: 3 },
    { code: 'PHYS501', title: 'Advanced Physics', department: 'PHYS', programs: ['MSPHYS'], credits: 3 },
    // HIST
    { code: 'HIST101', title: 'World History', department: 'HIST', programs: ['BAHIST', 'MAHIST'], credits: 3 },
    { code: 'HIST501', title: 'Advanced History', department: 'HIST', programs: ['MAHIST'], credits: 3 },
    // ECON
    { code: 'ECON101', title: 'Microeconomics', department: 'ECON', programs: ['BSECON', 'MSECON'], credits: 3 },
    { code: 'ECON501', title: 'Advanced Economics', department: 'ECON', programs: ['MSECON'], credits: 3 },
    // PSY
    { code: 'PSY101', title: 'Introduction to Psychology', department: 'PSY', programs: ['BSPSY', 'MSPSY'], credits: 3 },
    { code: 'PSY501', title: 'Advanced Psychology', department: 'PSY', programs: ['MSPSY'], credits: 3 },
    // ART
    { code: 'ART101', title: 'Art Fundamentals', department: 'ART', programs: ['BAART', 'MAART'], credits: 2 },
    { code: 'ART501', title: 'Advanced Art Studies', department: 'ART', programs: ['MAART'], credits: 2 },
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

  // --- Seed Exams and Assignments for Each Course ---
  // Find admin account id for createdById
  const admin = await prisma.account.findUnique({ where: { email: adminEmail } });
  const createdById = admin?.id;
  for (const course of Object.values(courses)) {
    // Seed Exam (one per course, type FINAL)
    const examTitle = `${course.title} Final Exam`;
    const existingExam = await prisma.exam.findFirst({ where: { title: examTitle, courseId: course.id } });
    if (!existingExam) {
      await prisma.exam.create({
        data: {
          title: examTitle,
          type: 'FINAL',
          courseId: course.id,
          createdById: createdById!,
          examDate: new Date('2026-06-01'),
          duration: 120,
          startTime: new Date('2026-06-01T09:00:00Z'),
          endTime: new Date('2026-06-01T11:00:00Z'),
          totalPoints: 100,
          weight: 1.0,
          isPublished: true,
        },
      });
    }

    // Seed Assignments (2 per course)
    for (let i = 1; i <= 2; i++) {
      const assignmentTitle = `${course.title} Assignment ${i}`;
      const existingAssignment = await prisma.assignment.findFirst({ where: { title: assignmentTitle, courseId: course.id } });
      if (!existingAssignment) {
        await prisma.assignment.create({
          data: {
            title: assignmentTitle,
            description: `Assignment ${i} for ${course.title}`,
            type: 'HOMEWORK',
            courseId: course.id,
            createdById: createdById!,
            dueDate: new Date(`2026-05-${10 + i}`),
            totalPoints: 20,
            weight: 1.0,
            isPublished: true,
          },
        });
      }
    }
  }
  console.log('Seeded exams and assignments for all courses.');

  // --- Seed All Possible Cohorts for All Programs (2025-2027, FALL/SPRING) ---
  const cohortYears = [2025, 2026, 2027];
  const cohortSemesters = ['FALL', 'SPRING'];
  const cohorts: Record<string, Awaited<ReturnType<typeof prisma.cohort.upsert>>> = {};
  for (const prog of Object.values(programs)) {
    for (const year of cohortYears) {
      for (const semester of cohortSemesters) {
        const code = `${prog.code}${year}${semester[0]}`;
        const name = `${prog.code}-${year}-${semester}`;
        const startDate = semester === 'FALL' ? new Date(`${year}-09-01`) : new Date(`${year}-02-01`);
        const endDate = semester === 'FALL' ? new Date(`${year + 4}-06-30`) : new Date(`${year + 4}-06-30`);
        cohorts[code] = await prisma.cohort.upsert({
          where: {
            programId_intakeYear_intakeSemester: {
              programId: prog.id,
              intakeYear: year,
              intakeSemester: semester,
            },
          },
          update: {},
          create: {
            name,
            code,
            program: { connect: { id: prog.id } },
            intakeYear: year,
            intakeSemester: semester,
            startDate,
            endDate,
          },
        });
      }
    }
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
