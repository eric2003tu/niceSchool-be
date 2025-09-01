Preamble

This document describes the backend surface that I implemented/updated in the repository. It is targeted at frontend developers who need to integrate with the API. It lists environment variables, global behavior, authentication, error handling, each public endpoint group, request/response shapes, and examples (curl / JSON). Use the API Swagger UI at /api/docs for a live, editable reference.

Checklist (what this file covers)
- Base URL, prefix and global headers
- Auth flow (register/login, forgot/reset), how to use JWTs
- All main endpoint groups and representative endpoints with method, path, payload, and response shapes
- File upload contract for assignment submissions
- Health & metrics endpoints
- Environment variables and developer / deployment notes (prisma, seed, memory flags)
- Error handling and status codes

## Global configuration
- Base path: http://<HOST>:<PORT>/api
  - The app uses a global prefix of `/api` in the server bootstrap. All endpoints below are relative to `/api`.
- Content-Type: application/json for most requests.
- Authentication header: Authorization: Bearer <JWT>
- Swagger UI: GET /api/docs
- Health: GET /api/health
- Metrics (Prometheus): GET /metrics (note: not under /api)

## Environment variables (required for running locally / in CI)
Preamble

This document describes the backend surface implemented in this repository. It's targeted at frontend developers who need to integrate with the API. It lists environment variables, global behavior, authentication, error handling, each public endpoint group, request/response shapes, and examples (curl / JSON). Use the API Swagger UI at /api/docs for a live, interactive reference.

Checklist (what this file covers)
- Base URL, prefix and global headers
- Auth flow (register/login, forgot/reset), and how to use JWTs
- Main endpoint groups with representative endpoints (method, path, payload, response shapes)
- File upload contract for assignment submissions
- Health & metrics endpoints
- Environment variables and developer / deployment notes (Prisma, seed, Node memory flags)
- Error handling and status codes

## Global configuration
- Base path: http(s)://<HOST>:<PORT>/api
  - The app uses a global prefix of `/api` in the server bootstrap. All endpoints below are relative to that prefix.
- Content-Type: application/json for most requests.
- Authentication header: Authorization: Bearer <JWT>
- Swagger UI: GET /api/docs
- Health: GET /api/health
- Metrics (Prometheus): GET /metrics (note: not under `/api`)

## Environment variables (required for running locally / in CI)
Place these keys in a local `.env` or in your deployment environment:
- DATABASE_URL — Postgres connection string used by Prisma
- JWT_SECRET — secret used to sign JWT tokens
- JWT_EXPIRES_IN — token TTL (e.g. `3600s` or `1h`)
- NODE_OPTIONS — optional memory flag for Node (e.g. `--max-old-space-size=1024`) for production
- MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS — SMTP settings used by password reset/email features
- PORT — application port (defaults to 3000 in development if not set)

Developer scripts (local)

- npm install
- npx prisma generate                # generate Prisma client
- npx prisma db push                 # apply schema changes without creating migrations
- npx prisma migrate dev --name <m>  # run dev migrations
- npx prisma db seed                 # run the TypeScript seed script
- npm run start:dev                  # run Nest in watch mode
- npm run build                      # transpile to dist/
- npm start                          # run built app (production)

Note: CI must run `npx prisma generate` before TypeScript compilation. The repository contains a `postinstall` that runs `prisma generate` to help with this.

## Authentication

All authenticated endpoints require a valid Bearer JWT in the `Authorization` header.

Common flow:
1. Register (POST /api/auth/register) — creates a user. Body: `{ email, password, firstName, lastName, phone? }`.
2. Login (POST /api/auth/login) — returns a JWT. Example response: `{ "access_token": "<token>", "expiresIn": "1h" }`.
3. Use the token for subsequent requests: `Authorization: Bearer <token>`.

Password reset:
- POST /api/auth/forgot — body: `{ email }` — triggers an email with a reset link containing a token.
- POST /api/auth/reset — body: `{ token, newPassword }` — uses the token to set a new password.

Notes about roles
- The system uses role-based guards with roles: `STUDENT`, `ADMIN`, `FACULTY`, `ALUMNI`.
- Endpoints that require roles will return `403 Forbidden` if the user lacks the role.

## Error handling

- The API returns standard HTTP status codes and a JSON body for errors.
- Common statuses:
  - `200 OK` — success
  - `201 Created` — resource created
  - `400 Bad Request` — validation failed
  - `401 Unauthorized` — missing/invalid token
  - `403 Forbidden` — role denied
  - `404 Not Found`
  - `409 Conflict` — duplicate/resource already exists
  - `500 Internal Server Error`

Typical error shape (AllExceptionsFilter is registered):

```
{
  "statusCode": 400,
  "timestamp": "2025-08-31T...",
  "path": "/api/whatever",
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Endpoints reference (by module)
Note: All examples assume the base URL `https://api.example.com/api`.

### Auth (/api/auth)

- POST /api/auth/register
  - Description: Register a new user.
  - Body (JSON):

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+2507..."
}
```

  - Response: `201 Created` or `409 Conflict` on duplicate email.

- POST /api/auth/login
  - Description: Get JWT token.
  - Body (JSON):

```json
{ "email": "user@example.com", "password": "secret" }
```

  - Response (200): `{ "access_token": "<jwt>", "expiresIn": "1h" }`.

- POST /api/auth/forgot
  - Body: `{ "email": "user@example.com" }` — Response: `200 OK` (sends email with reset token).

- POST /api/auth/reset
  - Body: `{ "token": "<token>", "newPassword": "newpass123" }` — Response: `200 OK` on success.

### Users (/api/users)

Require JWT for these endpoints; some require roles.

- POST /api/users
  - Create a user (Admin). Body: `{ email, password, firstName, lastName, role?, phone?, profileImage? }`.
  - Response: `201 Created` user (without password field).

- GET /api/users
  - List users (Admin only by role guard).

- GET /api/users/profile
  - Returns the current authenticated user's profile.
  - Response: `{ id, email, firstName, lastName, role, profileImage, phone }`.

- PATCH /api/users/profile
  - Update current user profile. Body: `{ firstName?, lastName?, phone?, profileImage? }`.

- PATCH /api/users/:id
  - Update by admin.

- DELETE /api/users/:id
  - Delete user (Admin only).

### Academics (/api/academics)

This module implements Departments, Programs, Courses, Cohorts, Enrollments, Assignments, Submissions, Exams, Results, and Attendance.

General: endpoints are namespaced under `/api/academics`, e.g., `/api/academics/departments`.

#### Departments
- POST /api/academics/departments
  - Body: `{ name, code, description?, headId? }` — Creates a department (Admin/Faculty as permitted by guards).
- GET /api/academics/departments
  - Returns list of departments (each may include programs, courses, head).
- GET /api/academics/departments/:id
  - Returns single department with relations.

#### Programs
- POST /api/academics/programs
  - Body: `{ name, code, level (UNDERGRAD|POSTGRAD|DIPLOMA|CERTIFICATE), departmentId, durationYears, description? }`.
- GET /api/academics/programs
  - Returns programs with courses and cohorts.

#### Courses
- POST /api/academics/courses
  - Body: `{ code, title, description?, credits?, departmentId?, programId?, semester? }`.
- GET /api/academics/courses[?programId=<id>]
  - Filter by `programId`.

#### Cohorts
- POST /api/academics/cohorts
  - Body: `{ name, programId, intakeYear }`.

#### Enrollments
- POST /api/academics/enrollments
  - Body: `{ studentId, cohortId, status? }` — Unique constraint: `studentId + cohortId`.

#### Assignments
- POST /api/academics/assignments
  - Body: `{ title, description?, courseId, dueDate?, totalMarks? }`.
- POST /api/academics/assignments/submit
  - Body (JSON): `{ assignmentId, studentId, submissionText? }` — or use `multipart/form-data` to upload a file (see file upload section).

#### Exams
- POST /api/academics/exams
  - Body: `{ title, courseId, examDate (ISO string), durationMin, totalMarks?, examType? }`.

#### Exam results
- POST /api/academics/exams/results
  - Body: `{ examId, studentId, marks, grade?, remarks? }`.

#### Attendance
- POST /api/academics/attendance
  - Body: `{ studentId, date (ISO), status (PRESENT|ABSENT|LATE|EXCUSED), courseId?, cohortId?, recordedById?, remarks? }`.

Responses: create endpoints return the created resource with its `id` and timestamps.

### Admissions (/api/admissions)

- POST /api/admissions/apply
  - Authenticated; Body: `CreateApplicationDto` — includes personal & academic info, program, academicYear, documents (JSON or links).
  - Returns created application ID/status.

- GET /api/admissions/applications (Admin/Faculty)
  - Query params: `page`, `limit`, `status`, `program`.

- GET /api/admissions/my-applications (Authenticated)
  - Returns applications for current user.

- PATCH /api/admissions/applications/:id/status (Admin/Faculty)
  - Body: `{ status: PENDING|APPROVED|REJECTED }`.

### Events (/api/events)

- POST /api/events
  - Body: `{ title, description, startDate, endDate, location, maxAttendees?, price?, category? }`.
- GET /api/events
  - Query: `page`, `limit`, `category`, `upcoming`.
- POST /api/events/:id/register
  - Body: `{ any registration metadata }`.
- DELETE /api/events/:id/register
  - Cancels registration for current user.

### News (/api/news)

- POST /api/news
  - Body: `{ title, content, excerpt?, imageUrl?, category? }`.
- GET /api/news
  - Pagination and search queries.
- PATCH /api/news/:id
- DELETE /api/news/:id

### Contact (/api/contact)

- POST /api/contact
  - Body: `{ firstName, lastName, email, phone?, subject, message }` — sends an email (nodemailer) and records the contact.

### Uploads (/api/upload)

- POST /api/upload
  - `multipart/form-data`; field `file` (single) — stores file and returns `{ url: "https://..." }`.
  - Field name conventions: `file` or `upload` depending on module; check `upload.controller` implementation. Use `enctype="multipart/form-data"` on HTML forms.

Assignment submission with file

- Endpoint: POST /api/academics/assignments/submit
- Use `multipart/form-data` with fields:
  - `file`: binary file to upload
  - `assignmentId`: string
  - `studentId`: string
  - `submissionText`: optional text
- Response: created `AssignmentSubmission` with `fileUrl` field populated.

Client-side: use FormData

```js
const fd = new FormData();
fd.append('file', fileInput.files[0]);
fd.append('assignmentId', assignmentId);
fd.append('studentId', studentId);
fd.append('submissionText', text);

fetch('/api/academics/assignments/submit', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + token },
  body: fd
});
```

### Health and Metrics

- GET /api/health
  - Quick readiness check (returns basic app status and DB connectivity if implemented).
- GET /metrics
  - Prometheus-format metrics (text/plain) from `prom-client`. Not under `/api`.

## API examples (curl)
Register & login

## Environment variables (required for running locally / in CI)
  -F "studentId=..."
```

## Data shapes (representative)

- CreateAssignmentDto
  - `{ title: string, description?: string, courseId: string, dueDate?: ISOString, totalMarks?: number }`
- SubmitAssignmentDto
  - `{ assignmentId: string, studentId: string, submissionText?: string }`
- CreateExamDto
  - `{ title: string, courseId: string, examDate: ISOString, durationMin: number, totalMarks?: number, examType?: string }`
- CreateMarkDto
  - `{ examId: string, studentId: string, marks: number, grade?: string, remarks?: string }`

## Notes for frontend devs / gotchas

- Always include `Authorization` header with Bearer token for protected endpoints.
- For multipart uploads do not set `Content-Type` manually — let the browser set the boundary.
- ID values are UUID strings.
- For pagination endpoints, use `page` and `limit` query params. The server expects numbers; converting strings is handled server-side in many endpoints but prefer sending numeric values.
- When you change Prisma models, run `npx prisma generate` locally so TypeScript sees the generated types.
- Some endpoints are guarded by roles; make sure the user JWT includes a `role` claim and that you call login to get fresh tokens.
# NiceSchool — Frontend Integration Guide (relationship-first)

This document is a complete, authoritative, developer- and machine-friendly integration guide for the NiceSchool backend. It mirrors the Prisma schema and explains every model, relationship, endpoint contract, request/response shapes, upload semantics, pagination, errors, and role rules.

Base assumptions
- Base API prefix: `/api` (confirm in `src/main.ts`).
- Protected endpoints require: `Authorization: Bearer <jwt>` header.
- Date/time: ISO 8601 strings.
- IDs: UUID strings.

## Quick checklist (what this file includes)
- Models and full relationship mapping (from `prisma/schema.prisma`).
- Endpoint list (method, path, headers, body, response) for all major modules.
- How to represent relationships in requests and how they appear in responses.
- File upload contract and example FormData usage.
- Pagination, filtering and include semantics.
- Error shape and status codes.
- Machine-friendly JSON snippets for AI ingestion.

## Authentication

- POST /api/auth/register
  - Body: { email, password, firstName, lastName, phone? }
  - Response: created user (no password field)

- POST /api/auth/login
  - Body: { email, password }
  - Response: { accessToken: "<jwt>", user: { id, email, firstName, lastName, role } }

- POST /api/auth/forgot
  - Body: { email }
  - Response: 200 OK (sends reset email)

- POST /api/auth/reset
  - Body: { token, newPassword }

Include header for protected endpoints:
Authorization: Bearer <token>

Roles: STUDENT, ADMIN, FACULTY, ALUMNI. 403 returned when role guard denies access.

## Global error shape

All non-2xx responses use this shape (unless endpoint documents otherwise):

{
  "statusCode": 400,
  "timestamp": "2025-09-01T...Z",
  "path": "/api/whatever",
  "message": "Validation failed or error message",
  "error": "Bad Request"
}

Validation messages may be a string or an array of messages.

## Pagination & include semantics

- Query params for lists: `page` (1-based, default 1), `limit` (default 20), `sort` (e.g. `createdAt,desc`), `q` (free-text), plus endpoint-specific filters.
- Include/Nested relations: use `include=` query param with comma-separated relation names. Example: `/api/users/:id?include=enrollments,applications`.
- List response format:

{
  "data": [ ... ],
  "meta": { "page": 1, "limit": 20, "total": 123 }
}

## Models and relationships (exhaustive)

Below is a compact mapping of each Prisma model and all relations. Use these when constructing requests and parsing responses.

User
- Fields: id, email, password, firstName, lastName, role, profileImage, phone, dateOfBirth, isActive, lastLogin, createdAt, updatedAt
- Relations:
  - news: News[] (one-to-many)
  - eventRegistrations: EventRegistration[]
  - applications: Application[]
  - passwordResetTokens: PasswordResetToken[]
  - enrollments: Enrollment[]
  - assignmentSubmissions: AssignmentSubmission[]
  - examResults: ExamResult[]
  - attendances: Attendance[]

Application
- Fields: id, applicantId, program, academicYear, status, personalInfo (Json), academicInfo (Json), documents (Json), personalStatement, adminNotes, submittedAt, reviewedAt, createdAt, updatedAt
- Relations: applicant: User (applicantId)

Faculty
- Fields: id, firstName, lastName, email, department, position, bio, profileImage, phone, office, specializations: string[], education: string[], publications: string[], isActive, createdAt, updatedAt
- Relations:
  - headedDepartments: Department[] (can be head of multiple departments)
  - courses: Course[] (instructor roles)
  - assignmentsPosted: Assignment[]
  - gradedSubmissions: AssignmentSubmission[]
  - examsCreated: Exam[]
  - timetableEntries: TimetableEntry[]
  - recordedAttendances: Attendance[]

News
- Fields: id, title, content, excerpt, imageUrl, category, isPublished, publishedAt, authorId, createdAt, updatedAt
- Relations: author: User (authorId)

Event
- Fields: id, title, description, startDate, endDate, location, imageUrl, category, isRegistrationOpen, maxAttendees, price, isPublished, createdAt, updatedAt
- Relations: registrations: EventRegistration[]

EventRegistration
- Fields: id, userId, eventId, status, notes, registeredAt
- Relations: user: User, event: Event
- Constraints: unique(userId, eventId)

PasswordResetToken
- Fields: id, userId, token, expiresAt, createdAt
- Relations: user: User

Department
- Fields: id, name, code, description, headId, createdAt, updatedAt
- Relations: head: Faculty?, programs: Program[], courses: Course[]

Program
- Fields: id, name, code, level, departmentId, durationYears, description, createdAt, updatedAt
- Relations: department: Department, courses: Course[], cohorts: Cohort[], gradeScales: GradeScale[]

Course
- Fields: id, code, title, description, credits, departmentId, programId, semester, createdAt, updatedAt
- Relations:
  - department: Department?
  - program: Program?
  - instructors: Faculty[] (many-to-many)
  - assignments: Assignment[]
  - exams: Exam[]
  - timetableEntries: TimetableEntry[]
  - attendances: Attendance[]

Cohort
- Fields: id, name, programId, intakeYear, createdAt, updatedAt
- Relations: program: Program, students: Enrollment[], timetable: TimetableEntry[], attendances: Attendance[]

Enrollment
- Fields: id, studentId, cohortId, status, enrolledAt, leftAt
- Relations: student: User, cohort: Cohort
- Constraints: unique(studentId, cohortId)

Assignment
- Fields: id, title, description, courseId, postedById, postedAt, dueDate, totalMarks, submissions: AssignmentSubmission[], createdAt, updatedAt
- Relations: course: Course, postedBy: Faculty?

AssignmentSubmission
- Fields: id, assignmentId, studentId, submittedAt, submissionText, fileUrl, marksAwarded, gradedById, gradedAt, feedback
- Relations: assignment: Assignment, student: User, gradedBy: Faculty?
- Constraints: unique(assignmentId, studentId)

Exam
- Fields: id, title, courseId, examDate, durationMin, totalMarks, examType, createdById, isPublished, results: ExamResult[], createdAt, updatedAt
- Relations: course: Course, createdBy: Faculty?

ExamResult
- Fields: id, examId, studentId, marks, grade, remarks, recordedAt
- Relations: exam: Exam, student: User
- Constraints: unique(examId, studentId)

GradeScale
- Fields: id, programId, minMarks, maxMarks, grade, points
- Relations: program: Program?

TimetableEntry
- Fields: id, cohortId, courseId, instructorId, day, startTime, endTime, location
- Relations: cohort: Cohort, course: Course, instructor: Faculty?

Attendance
- Fields: id, studentId, cohortId?, courseId?, date, status, recordedById?, remarks
- Relations: student: User, cohort: Cohort?, course: Course?, recordedBy: Faculty?

Relationship quick map (text)
- User 1 -> * News, EventRegistration, Application, Enrollment, AssignmentSubmission, ExamResult, Attendance
- Department 1 -> * Program, Course
- Program 1 -> * Course, Cohort, GradeScale
- Course * <-> * Faculty (instructors) — implicit many-to-many
- Course 1 -> * Assignment, Exam, TimetableEntry, Attendance
- Assignment 1 -> * AssignmentSubmission (unique per student)
- Exam 1 -> * ExamResult (unique per student)

## How to represent relations in requests

- Use IDs for foreign keys. Example: create Enrollment -> { studentId: "<user-uuid>", cohortId: "<cohort-uuid>" }.
- For many-to-many relations (Course instructors), use a dedicated endpoint (e.g., `PATCH /api/academics/courses/:id/instructors` with `{ instructorIds: [] }`) or call module-specific endpoints if present.
- For nested creation, the backend currently expects parents first then children (no nested create payloads unless controllers explicitly state otherwise).

## Endpoints (canonical examples and shapes)

Below are canonical endpoints the frontend will use heavily. For each: auth requirement, request body, response example, and notes about relations.

Auth
- POST /api/auth/register
  - Body: { email, password, firstName, lastName, phone? }
  - 201: { id, email, firstName, lastName, role }

- POST /api/auth/login
  - Body: { email, password }
  - 200: { accessToken, user }

Users
- GET /api/users?page&limit&role
  - Auth: ADMIN
  - Response: { data: [User], meta }

- GET /api/users/:id?include=enrollments,applications
  - Auth: token (self or admin)
  - Response: User with requested relations.

- GET /api/users/profile
  - Auth: token
  - Response: current user summary

- PATCH /api/users/profile
  - Auth: token
  - Body: partial profile (firstName,lastName,phone,profileImage)

Departments
- POST /api/academics/departments
  - Auth: ADMIN
  - Body: { name, code, description?, headId? }
  - Response: created Department (head as id)

Programs
- POST /api/academics/programs
  - Auth: ADMIN
  - Body: { name, code, level, departmentId, durationYears, description? }

Courses
- POST /api/academics/courses
  - Auth: ADMIN or FACULTY
  - Body: { code, title, description?, credits?, departmentId?, programId?, semester? }

- PATCH /api/academics/courses/:id/instructors
  - Auth: ADMIN
  - Body: { instructorIds: ["faculty-uuid", ...] }
  - Effect: sets many-to-many instructors for course (idempotent replace or add depending on implementation). Check controller behavior; frontend should send full list to replace.

Cohorts & Enrollments
- POST /api/academics/cohorts
  - Auth: ADMIN
  - Body: { name, programId, intakeYear }

- POST /api/academics/enrollments
  - Auth: ADMIN or FACULTY
  - Body: { studentId, cohortId }
  - 201: created Enrollment (unique constraint: studentId+cohortId -> 409 on duplicate)

Assignments & Submissions
- POST /api/academics/assignments
  - Auth: FACULTY
  - Body: { title, description?, courseId, dueDate?, totalMarks? }

- POST /api/academics/assignments/:id/submissions
  - Auth: STUDENT
  - Content-Type: multipart/form-data OR application/json (fileUrl)
  - Form fields: file (binary), submissionText
  - JSON body alternative: { assignmentId, studentId, submissionText, fileUrl }
  - 201: AssignmentSubmission

- PATCH /api/academics/submissions/:id/grade
  - Auth: FACULTY
  - Body: { marksAwarded, feedback }

Exams & Results
- POST /api/academics/exams
  - Auth: FACULTY
  - Body: { title, courseId, examDate, durationMin, totalMarks, examType }

- POST /api/academics/exams/:id/results
  - Auth: FACULTY
  - Body: { studentId, marks, grade?, remarks? }

Attendance
- POST /api/academics/attendance
  - Auth: FACULTY
  - Body: { studentId, date, status, cohortId?, courseId?, recordedById?, remarks? }

Events & Registrations
- POST /api/events
  - Auth: ADMIN
  - Body: { title, description, startDate, endDate, location, category?, maxAttendees?, price? }

- POST /api/events/:id/register
  - Auth: token
  - Body: { notes? }
  - 201: EventRegistration

News
- POST /api/news
  - Auth: ADMIN or FACULTY
  - Body: { title, content, excerpt?, imageUrl?, category?, isPublished? }

Upload
- POST /api/upload
  - Content-Type: multipart/form-data
  - Field: file
  - Response: { fileUrl }

Admissions
- POST /api/admissions/apply
  - Auth: token (applicant)
  - Body example:
  {
    "program": "BSc Computer Science",
    "academicYear": "2025/2026",
    "personalInfo": { "address": "..." },
    "academicInfo": { "lastInstitution": "..." },
    "documents": { "transcriptUrl": "..." }
  }

- PATCH /api/admissions/applications/:id/status
  - Auth: ADMIN
  - Body: { status: "APPROVED" | "REJECTED", adminNotes?: string }

## File upload example (FormData)

const fd = new FormData();
fd.append('file', fileInput.files[0]);
fd.append('assignmentId', assignmentId);
fd.append('studentId', studentId);

fetch('/api/academics/assignments/123/submissions', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + token },
  body: fd
});

Do not set Content-Type manually; the browser will include the boundary.

## Duplicate / unique constraints to handle on frontend
- Enrollment: unique(studentId, cohortId) — backend returns 409 on violation.
- EventRegistration: unique(userId, eventId) — return 409 on duplicate.
- AssignmentSubmission: unique(assignmentId, studentId) — return 409 on duplicate.
- ExamResult: unique(examId, studentId) — return 409 on duplicate.

## Machine-friendly JSON snippets (for AI ingestion)

User (simplified schema)
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "email": { "type": "string" },
    "firstName": { "type": "string" },
    "lastName": { "type": "string" },
    "role": { "type": "string", "enum": ["STUDENT","ADMIN","FACULTY","ALUMNI"] }
  },
  "required": ["id","email","firstName","lastName","role"]
}

Enrollment (simplified)
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "studentId": { "type": "string" },
    "cohortId": { "type": "string" },
    "status": { "type": "string" }
  },
  "required": ["id","studentId","cohortId"]
}

## Implementation tips (pro tips)

- Always use server-provided IDs when wiring relations in the UI.
- For update endpoints that accept arrays (e.g., course instructors), send the intended final array for idempotency.
- Treat duplicate-create responses (409) as an idempotency signal — fetch the resource instead of retrying blindly.
- Use `include` query param to fetch nested relations when you need them in a single request. If large, prefer separate calls.
- Use small `limit` values for tables with many rows; implement infinite scroll or server-side pagination.

## Next deliverables I can produce on request
- Generate a Postman collection for the endpoints listed above.
- Produce a minimal OpenAPI 3.0 snippet for auth, users, enrollments, assignments/submissions.
- Generate typed TypeScript fetch wrappers (api client) for the frontend.

---

If you want me to commit this file, tell me and I will add and push it to the repository.
