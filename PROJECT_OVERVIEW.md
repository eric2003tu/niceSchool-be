# niceSchool-be: Backend Project Overview

## Introduction

`niceSchool-be` is the backend API for the niceSchool platform, powering all school management, engagement, and communication features for the frontend (`niceSchool-fe`). Built with NestJS, Prisma, and PostgreSQL, it provides secure, scalable, and maintainable RESTful endpoints for admissions, events, news, users, faculty, alumni, and more.

## Main Features & API Endpoints

| Feature         | Endpoint Example                | Method | Description |
|-----------------|---------------------------------|--------|-------------|
| News List       | `/api/news`                    | GET    | Get all news articles |
| News Details    | `/api/news/:id`                | GET    | Get single article |
| Events List     | `/api/events`                  | GET    | Get all events |
| Event Register  | `/api/events/:id/register`     | POST   | Register for event |
| Admissions Req. | `/api/admissions/requirements` | GET    | Get requirements |
| Apply           | `/api/apply`                   | POST   | Submit application |
| Faculty List    | `/api/faculty`                 | GET    | Get faculty profiles |
| Contact Submit  | `/api/contact`                 | POST   | Submit contact form |
| User Profile    | `/api/users/profile`           | GET    | Get current user profile |
| Alumni List     | `/api/alumni`                  | GET    | Get alumni profiles |

## Technology Stack

- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Validation:** Class-validator, DTOs
- **File Uploads:** Multer
- **Documentation:** Swagger/OpenAPI

## Project Structure

```
prisma/
  schema.prisma         # Database schema
src/
  app.module.ts         # Main module
  main.ts               # Entry point
  ...                   # Feature modules (users, news, events, admissions, etc.)
.env                    # Environment variables
README.md
PROJECT_OVERVIEW.md     # <-- This file
```

## Key Modules

- **Users:** Registration, login, profile, role management
- **Admissions:** Application submission, requirements, status tracking
- **News:** CRUD for news articles, categories
- **Events:** Event creation, listing, registration
- **Faculty:** Directory, profiles, departments
- **Alumni:** Profiles, events, networking
- **Contact:** Contact form submission, info
- **Dashboard:** Aggregated stats, personalized info
- **Auth:** JWT authentication, guards, strategies
- **Upload:** File/document upload endpoints

## Data Models (Prisma Example)

### User
```ts
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  firstName   String
  lastName    String
  role        UserRole
  profileImage String?
  phone       String?
  dateOfBirth DateTime?
  isActive    Boolean  @default(true)
  lastLogin   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### News
```ts
model News {
  id        String   @id @default(uuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Event
```ts
model Event {
  id          String   @id @default(uuid())
  title       String
  description String
  date        DateTime
  location    String
  imageUrl    String?
  registrations EventRegistration[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Application
```ts
model Application {
  id           String   @id @default(uuid())
  applicantId  String
  applicant    User     @relation(fields: [applicantId], references: [id])
  program      String
  status       ApplicationStatus
  submittedAt  DateTime @default(now())
}
```

### Faculty
```ts
model Faculty {
  id          String   @id @default(uuid())
  firstName   String
  lastName    String
  email       String   @unique
  department  String
  position    String
  bio         String?
  profileImage String?
  phone       String?
  office      String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Authentication & Roles
- JWT-based authentication for login/register
- Role-based access control (student, admin, faculty, alumni)
- Guards and decorators for protected routes

## Integration Guide for Frontend Developers

- All endpoints follow RESTful conventions and return JSON.
- Use JWT for authentication; send token in `Authorization: Bearer <token>` header.
- Pagination, filtering, and search supported for lists (news, events, faculty).
- File uploads via multipart/form-data (Multer).
- Error responses include status codes and messages.
- Swagger docs available at `/api/docs` (if enabled).

## How to Run the Backend

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Edit `.env` for database, JWT, email, etc.
3. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```
4. **Start the server:**
   ```bash
   npm run start:dev
   ```
5. **API available at:**
   - `http://localhost:3001/api`

## Collaboration Workflow

- Keep API docs up to date for frontend integration.
- Use consistent naming and error formats.
- Sync regularly with frontend team on endpoints and data models.
- Provide mock data or endpoint samples as needed.

## Summary

`niceSchool-be` is a robust backend for school management, supporting all frontend features with secure, scalable APIs. Explore the modules, review the data models, and use the provided endpoints to build a seamless frontend experience.

For questions or contributions, contact the project maintainers.
