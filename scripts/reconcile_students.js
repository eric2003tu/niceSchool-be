#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generate6Digit() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function ensureUniqueStudentNumber() {
  for (let i = 0; i < 100; i++) {
    const cand = generate6Digit();
    const exists = await prisma.student.findFirst({ where: { studentNumber: cand } });
    if (!exists) return cand;
  }
  return `9${Date.now().toString().slice(-5)}`;
}

async function run() {
  console.log('Starting reconciliation: ensure Student rows for approved applications and update memberships');
  const approved = await prisma.application.findMany({ where: { status: 'APPROVED' }, include: { applicant: true } });
  console.log('Approved applications found:', approved.length);

  const summary = { createdStudents: 0, updatedStudentPrograms: 0, updatedStudentCourses: 0, errors: 0 };

  for (const app of approved) {
    try {
      let student = await prisma.student.findUnique({ where: { applicationId: app.id } });
      if (!student) {
        // create student
        const sn = await ensureUniqueStudentNumber();
        student = await prisma.student.create({ data: {
          applicationId: app.id,
          studentNumber: sn,
          programId: app.programId || undefined,
          academicYear: app.academicYear || undefined,
          personalInfo: app.personalInfo || undefined,
          academicInfo: app.academicInfo || undefined,
          documents: app.documents || undefined,
          personalStatement: app.personalStatement || undefined,
        } });
        summary.createdStudents++;
        console.log(`Created student ${student.id} for application ${app.id}`);
      }

      // Update any StudentProgram rows that reference the applicant user id (legacy)
      if (app.programId) {
        const legacySPs = await prisma.studentProgram.findMany({ where: { programId: app.programId, studentId: app.applicantId } });
        for (const sp of legacySPs) {
          await prisma.studentProgram.update({ where: { id: sp.id }, data: { studentId: student.id } });
          summary.updatedStudentPrograms++;
          console.log(`Repointed StudentProgram ${sp.id} -> student ${student.id}`);
        }
      }

      // Update StudentCourse rows
      if (app.courseId) {
        const legacySCs = await prisma.studentCourse.findMany({ where: { courseId: app.courseId, studentId: app.applicantId } });
        for (const sc of legacySCs) {
          await prisma.studentCourse.update({ where: { id: sc.id }, data: { studentId: student.id } });
          summary.updatedStudentCourses++;
          console.log(`Repointed StudentCourse ${sc.id} -> student ${student.id}`);
        }
      }

    } catch (err) {
      summary.errors++;
      console.error('Error processing app', app.id, err.message || err);
    }
  }

  console.log('Done. Summary:', summary);
  await prisma.$disconnect();
}

run().catch(async (e) => {
  console.error('Unhandled error:', e);
  try { await prisma.$disconnect(); } catch (e2) {}
  process.exit(1);
});
