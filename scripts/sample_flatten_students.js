const { PrismaClient } = require('@prisma/client');
(async function(){
  const p = new PrismaClient();
  try {
    const memberships = await p.studentProgram.findMany({ include: { student: true } });
    const mapped = memberships.map(m => {
      const s = m.student;
      const personal = s.personalInfo || {};
      return { student: { id: s.id, email: personal.email || (s.studentNumber?`${s.studentNumber}@students.local`:null), password: null, firstName: personal.firstName || null, lastName: personal.lastName || null, studentNumber: s.studentNumber, role: 'STUDENT', profileImage: personal.profileImage || null, phone: personal.phone || null, dateOfBirth: personal.dateOfBirth || null, isActive: true, lastLogin: null, createdAt: s.createdAt, updatedAt: s.updatedAt, personalInfo: s.personalInfo||{}, academicInfo: s.academicInfo||{}, documents: s.documents||{} }, enrolledAt: m.enrolledAt };
    });
    console.log(JSON.stringify({ meta: { page:1, limit:20, total: mapped.length }, data: mapped }, null, 2));
  } catch (err) { console.error(err); }
  finally { await p.$disconnect(); }
})();
