const { PrismaClient } = require('@prisma/client');
(async function(){
  const p = new PrismaClient();
  try {
    const s = await p.student.findFirst({});
    if (!s) { console.log('no student found'); return; }
    const programId = s.programId;
    console.log('sample programId', programId);
    const memberships = await p.studentProgram.findMany({ where: { programId }, include: { student: true } });
    console.log(JSON.stringify(memberships.map(m => ({ student: { id: m.student.id, studentNumber: m.student.studentNumber, email: (m.student.personalInfo && m.student.personalInfo.email) || (m.student.studentNumber ? m.student.studentNumber + '@students.local' : null), firstName: (m.student.personalInfo && m.student.personalInfo.firstName) || null, lastName: (m.student.personalInfo && m.student.personalInfo.lastName) || null, createdAt: m.student.createdAt, updatedAt: m.student.updatedAt }, enrolledAt: m.enrolledAt })), null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await p.$disconnect();
  }
})();
