#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

function generate6Digit() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function ensureUniqueStudentNumber() {
  for (let i = 0; i < 200; i++) {
    const cand = generate6Digit();
    const exists = await prisma.student.findFirst({ where: { studentNumber: cand } });
    if (!exists) return cand;
  }
  return `9${Date.now().toString().slice(-5)}`;
}

async function run() {
  console.log('Verifying approved applications -> student records, creating missing students, then exporting CSV');
  const apps = await prisma.application.findMany({ where: { status: 'APPROVED' } });
  console.log('Approved applications found:', apps.length);

  const summary = { created: 0, already: 0, errors: 0 };
  for (const app of apps) {
    try {
      const existing = await prisma.student.findUnique({ where: { applicationId: app.id } });
      if (existing) {
        summary.already++;
        continue;
      }
      // create student
      const sn = await ensureUniqueStudentNumber();
      await prisma.student.create({ data: {
        applicationId: app.id,
        studentNumber: sn,
        programId: app.programId || undefined,
        academicYear: app.academicYear || undefined,
        personalInfo: app.personalInfo || undefined,
        academicInfo: app.academicInfo || undefined,
        documents: app.documents || undefined,
        personalStatement: app.personalStatement || undefined,
      } });
      summary.created++;
      console.log('Created student for application', app.id);
    } catch (err) {
      summary.errors++;
      console.error('Error creating student for', app.id, err && err.message ? err.message : err);
    }
  }

  // Export CSV of all students that have applicationId
  const students = await prisma.student.findMany({ where: { applicationId: { not: null } } });
  const outDir = path.resolve(__dirname, '..', 'exports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = path.join(outDir, 'promoted_applications.csv');
  const header = 'studentNumber,studentId,applicationId,programId,academicYear,enrolledAt\n';
  const lines = students.map(s => {
    const sn = s.studentNumber || '';
    const sid = s.id;
    const aid = s.applicationId || '';
    const pid = s.programId || '';
    const ay = s.academicYear || '';
    const ea = s.enrolledAt ? s.enrolledAt.toISOString() : '';
    return [sn, sid, aid, pid, ay, ea].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
  });
  fs.writeFileSync(outPath, header + lines.join('\n'));

  console.log('Done. Summary:', summary);
  console.log('Export written to', outPath, 'rows:', students.length);
  await prisma.$disconnect();
}

run().catch(async (e) => {
  console.error('Unhandled error:', e.message || e);
  try { await prisma.$disconnect(); } catch (e2) {}
  process.exit(1);
});
