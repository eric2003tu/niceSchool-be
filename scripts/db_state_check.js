const { PrismaClient } = require('@prisma/client');
(async function(){
  const p = new PrismaClient();
  try {
    const approvedApps = await p.application.count({ where: { status: 'APPROVED' } });
    const studentsFromApps = await p.student.count({ where: { applicationId: { not: null } } });
    const totalStudents = await p.student.count();
    const studentPrograms = await p.studentProgram.count();
    const studentCourses = await p.studentCourse.count();
    const appsWithoutStudent = await p.application.findMany({ where: { status: 'APPROVED', NOT: { id: { in: (await p.student.findMany({ where: { applicationId: { not: null } }, select: { applicationId: true } })).map(s=>s.applicationId) } } }, select: { id: true } });

    console.log(JSON.stringify({ approvedApps, studentsFromApps, totalStudents, studentPrograms, studentCourses, appsWithoutStudentCount: appsWithoutStudent.length, appsWithoutStudentSample: appsWithoutStudent.slice(0,5) }, null, 2));
  } catch (err) {
    console.error('error', err);
  } finally {
    await p.$disconnect();
  }
})();
