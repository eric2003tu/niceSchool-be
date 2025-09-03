#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function isEmpty(obj) {
  if (obj === null || obj === undefined) return true;
  if (typeof obj !== 'object') return false;
  return Object.keys(obj).length === 0;
}

async function run() {
  console.log('Ensuring Student personalInfo, academicInfo, and documents/educational background are present');
  const students = await prisma.student.findMany({});
  console.log('Students checked:', students.length);
  const summary = { updated: 0, unchanged: 0, errors: 0 };

  for (const s of students) {
    try {
      const updates = {};
      let application = null;
      let applicant = null;

      if (s.applicationId) {
        application = await prisma.application.findUnique({ where: { id: s.applicationId } });
        if (application && application.applicantId) {
          applicant = await prisma.user.findUnique({ where: { id: application.applicantId } });
        }
      }

      // personalInfo: prefer application.personalInfo, then applicant User fields
      if (isEmpty(s.personalInfo)) {
        if (application && application.personalInfo && !isEmpty(application.personalInfo)) {
          updates.personalInfo = application.personalInfo;
        } else if (applicant) {
          updates.personalInfo = {
            email: applicant.email || null,
            firstName: applicant.firstName || null,
            lastName: applicant.lastName || null,
            phone: applicant.phone || null,
            profileImage: applicant.profileImage || null,
            dateOfBirth: applicant.dateOfBirth ? applicant.dateOfBirth.toISOString() : null,
          };
        } else {
          updates.personalInfo = { email: null, firstName: null, lastName: null };
        }
      }

      // academicInfo: prefer application.academicInfo, then set empty structured object
      if (isEmpty(s.academicInfo)) {
        if (application && application.academicInfo && !isEmpty(application.academicInfo)) {
          updates.academicInfo = application.academicInfo;
        } else {
          updates.academicInfo = {
            previousEducation: [],
            qualifications: [],
            gpa: null,
            notes: null,
          };
        }
      } else {
        // ensure structured fields exist
        const ai = { ...s.academicInfo };
        if (!ai.previousEducation) ai.previousEducation = [];
        if (!ai.qualifications) ai.qualifications = [];
        if (!('gpa' in ai)) ai.gpa = null;
        if (!('notes' in ai)) ai.notes = null;
        updates.academicInfo = ai;
      }

      // documents: prefer application.documents
      if (isEmpty(s.documents)) {
        if (application && application.documents && !isEmpty(application.documents)) {
          updates.documents = application.documents;
        } else {
          updates.documents = {};
        }
      }

      // only update if there are changes compared to current
      const needUpdate = Object.keys(updates).some(k => {
        const before = s[k];
        const after = updates[k];
        try {
          return JSON.stringify(before || {}) !== JSON.stringify(after || {});
        } catch (_) { return true; }
      });

      if (needUpdate) {
        await prisma.student.update({ where: { id: s.id }, data: updates });
        summary.updated++;
        console.log(`Updated student ${s.id}`);
      } else {
        summary.unchanged++;
      }
    } catch (err) {
      summary.errors++;
      console.error('Error processing student', s.id, err.message || err);
    }
  }

  console.log('Done. Summary:', summary);
  await prisma.$disconnect();
}

run().catch(async (e) => {
  console.error('Unhandled error:', e.message || e);
  try { await prisma.$disconnect(); } catch (e2) {}
  process.exit(1);
});
