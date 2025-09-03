#!/usr/bin/env node
// Export promoted approved applications to CSV: studentNumber,userId,appId

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('Exporting promoted approved applications to CSV...');

  const apps = await prisma.application.findMany({
    where: { status: 'APPROVED' },
    include: { applicant: true },
  });

  const rows = [];
  for (const app of apps) {
    const user = app.applicant;
    if (!user) continue;
    if (user.studentNumber) {
      rows.push({ studentNumber: user.studentNumber, userId: user.id, appId: app.id });
    }
  }

  const outDir = path.resolve(__dirname, '..', 'exports');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'promoted_applications.csv');

  const header = 'studentNumber,userId,appId';
  const csv = [header, ...rows.map(r => `${r.studentNumber},${r.userId},${r.appId}`)].join('\n');
  fs.writeFileSync(outPath, csv, 'utf8');

  console.log(`Wrote ${rows.length} rows to ${outPath}`);
  await prisma.$disconnect();
}

run().catch(async (err) => {
  console.error('Error exporting promoted applications:', err.message || err);
  try { await prisma.$disconnect(); } catch (e) {}
  process.exit(1);
});
