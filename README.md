
# niceSchool-be

NiceSchool website backend

## Prisma / database

After you modify `prisma/schema.prisma` run the following locally to apply schema changes and generate the client:

1. Install dependencies (if not done):

```powershell
npm install
```

1. Generate Prisma client:

```powershell
npx prisma generate
```

1. Apply migrations (dev) or push schema to DB:

```powershell
npx prisma migrate dev --name init
# or when you prefer pushing schema without creating migration files
npx prisma db push
```

1. Seed the DB (the project defines a TypeScript seed script):

```powershell
npx prisma db seed
```

Note: After running `prisma generate`, TypeScript will understand the new models (e.g. `prisma.department`) and the IDE/linter errors about missing model properties will disappear.
