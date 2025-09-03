const { PrismaClient } = require('@prisma/client');
(async function(){
  const p = new PrismaClient();
  try {
    const memberships = await p.studentProgram.findMany({ include: { student: true } });
    console.log(JSON.stringify(memberships.map(m => ({ id: m.id, programId: m.programId, enrolledAt: m.enrolledAt, student: { id: m.student.id, studentNumber: m.student.studentNumber, email: m.student.personalInfo && m.student.personalInfo.email, firstName: m.student.personalInfo && m.student.personalInfo.firstName, lastName: m.student.personalInfo && m.student.personalInfo.lastName, createdAt: m.student.createdAt } })), null, 2));
  } catch (err) { console.error(err); }
  finally { await p.$disconnect(); }
})();
