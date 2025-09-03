#!/usr/bin/env node
// Promote approved applications to student memberships (StudentProgram/StudentCourse)
// Usage: node scripts/promoteApprovedApplications.js [--apply]

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generate6Digit() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function tableExists(tableName) {
  try {
    const res = await prisma.$queryRawUnsafe(
      `SELECT exists(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name = '${tableName}') as exists`
    );
    if (Array.isArray(res) && res.length > 0) return !!res[0].exists;
    return false;
  } catch (err) {
    return false;
  }
}

async function run() {
  const apply = process.argv.includes('--apply');
  console.log(`Running promoteApprovedApplications (${apply ? 'APPLY' : 'DRY RUN'})`);

  try {
    await prisma.$queryRawUnsafe('SELECT 1');
  } catch (err) {
    console.error('Database connection failed:', err.message || err);
    process.exit(1);
  }

  const spExists = await tableExists('StudentProgram');
  const scExists = await tableExists('StudentCourse');

  if (!spExists && !apply) {
    console.error('StudentProgram table is missing. Run migrations or prisma db push before applying.');
    process.exit(1);
  }

  // Process all approved applications (including those without program/course).
  const apps = await prisma.application.findMany({
    where: { status: 'APPROVED' },
    include: { applicant: true },
  });

  console.log(`Found ${apps.length} approved applications with programId.`);

  const summary = { promoted: 0, skippedAlreadyMember: 0, errors: 0, details: [] };

  for (const app of apps) {
    const applicant = app.applicant;
    const programId = app.programId;
    const courseId = app.courseId;

    let alreadyMember = false;
    if (spExists && programId) {
      try {
        const existing = await prisma.studentProgram.findFirst({ where: { studentId: applicant.id, programId } });
        if (existing) alreadyMember = true;
      } catch (err) {
        console.warn('studentProgram lookup failed (client/schema mismatch?):', err.message || err);
        if (!apply) {
          summary.details.push({ appId: app.id, status: 'lookup_failed' });
          continue;
        }
      }
    }

    if (alreadyMember) {
      summary.skippedAlreadyMember++;
      summary.details.push({ appId: app.id, status: 'already_member' });
      continue;
    }

    const personal = (app.personalInfo && typeof app.personalInfo === 'object') ? app.personalInfo : {};
    const updateData = {};
    if (personal.firstName) updateData.firstName = personal.firstName;
    if (personal.lastName) updateData.lastName = personal.lastName;
    if (personal.phone) updateData.phone = personal.phone;
    if (personal.dateOfBirth) {
      const d = new Date(personal.dateOfBirth);
      if (!isNaN(d)) updateData.dateOfBirth = d;
    }

    let studentNumber = applicant.studentNumber;
    if (!studentNumber) {
      let attempts = 0;
      while (!studentNumber && attempts < 100) {
        const cand = generate6Digit();
        const exists = await prisma.user.findFirst({ where: { studentNumber: cand } });
        if (!exists) studentNumber = cand;
        attempts++;
      }
      if (studentNumber) updateData.studentNumber = studentNumber;
    }

    if (!apply) {
      summary.details.push({ appId: app.id, applicantId: applicant.id, willCreateStudentNumber: !!studentNumber, willAddProgram: spExists, willAddCourse: scExists && !!courseId });
      continue;
    }

    try {
      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({ where: { id: applicant.id }, data: updateData });
      }

      if (applicant.role !== 'STUDENT') {
        await prisma.user.update({ where: { id: applicant.id }, data: { role: 'STUDENT' } });
      }

      if (spExists && programId) {
        await prisma.studentProgram.upsert({
          where: { studentId_programId: { studentId: applicant.id, programId } },
          create: { studentId: applicant.id, programId },
          update: {},
        }).catch(() => {});
      }

      if (scExists && courseId) {
        await prisma.studentCourse.upsert({
          where: { studentId_courseId: { studentId: applicant.id, courseId } },
          create: { studentId: applicant.id, courseId },
          update: {},
        }).catch(() => {});
      }

      summary.promoted++;
      summary.details.push({ appId: app.id, status: 'promoted' });
    } catch (err) {
      summary.errors++;
      summary.details.push({ appId: app.id, status: 'error', error: err.message || String(err) });
      console.error(`Failed to promote application ${app.id}:`, err.message || err);
    }
  }

  console.log('Summary:', summary);
  await prisma.$disconnect();
}

run().catch(async (e) => {
  console.error('Unhandled error:', e.message || e);
  try { await prisma.$disconnect(); } catch (e2) {}
  process.exit(1);
});
