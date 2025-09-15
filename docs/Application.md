Purpose

This doc explains how the frontend should collect and send admission application data to the backend (`POST /api/admissions/apply`). It lists the expected payload shape, alternative shapes the backend accepts, validation rules, common errors, and quick examples (fetch / PowerShell).

Checklist (what frontend must handle)

- Collect Department, Program, Course selection from the user and use IDs when possible.
- Collect `personalInfo`, `academicInfo` and optional `documents` as plain objects (no class instances).
- Ensure program belongs to department and course belongs to program before sending (frontend-side check improves UX).
- Send a JWT in Authorization header (Bearer) — endpoint requires authenticated user.
- Handle 400 responses and show the specific server message to the user.

API endpoints (use these to populate selects)

- GET /api/academics/departments -> list departments
- GET /api/academics/departments/:id/programs -> programs for a department
- GET /api/academics/programs/:id/courses -> courses for a program
- POST /api/admissions/apply -> create application (authenticated)

Auth

- `POST /api/admissions/apply` requires Authorization: Bearer <jwt> header. Ensure the current user is logged in and the token is fresh.

Payload shape (recommended canonical shape)

- Preferred: send IDs explicitly

{
  "departmentId": "<department-uuid>",
  "programId": "<program-uuid>",
  "courseId": "<course-uuid>",
  "academicYear": "2025",
  "personalInfo": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "+250700000000",
    "dateOfBirth": "2000-01-01",
    "address": "123 Main St",
    "nationality": "Rwanda"
  },
  "academicInfo": {
    "previousEducation": "High School",
    "gpa": 3.5,
    "graduationYear": 2023,
    "institution": "Some High School"
  },
  "documents": {
    "transcript": "https://uploads.../file1.pdf",
    "recommendationLetter": "https://uploads.../file2.pdf"
  }
}

Alternative shapes the backend accepts

- The backend also accepts nested reference objects emitted by some UI components. Example:

{
  "department": { "id": "<department-uuid>", "name": "Faculty of Science" },
  "program": { "id": "<program-uuid>", "name": "BSc Computer Science" },
  "course": { "id": "<course-uuid>", "title": "Intro to CS" },
  ... other fields as above
}

Notes:
- If you send the nested objects, the backend will extract `.id` from these objects.
- Prefer sending the explicit id fields to keep payloads minimal and avoid validation surprises.

Client-side recommended workflow

1. Load departments: GET /api/academics/departments.
2. When a department is selected, load programs: GET /api/academics/departments/:id/programs.
3. When a program is selected, load courses: GET /api/academics/programs/:id/courses.
4. Validate on the client that program.departmentId === department.id and course.programId === program.id before submitting.

Validation rules (server-side authoritative)

The server enforces the following and returns 400 with a clear message when violated:
- departmentId must exist -> "Invalid departmentId"
- programId must exist -> "Invalid programId"
- program.departmentId must equal departmentId -> "Program does not belong to the specified department"
- courseId must exist -> "Invalid courseId"
- course.programId must equal programId -> "Course does not belong to the specified program"
- Duplicate application check: a user cannot apply to the same program for the same academicYear twice -> "Application already exists for this program and academic year"
- DTO (field) validation errors will return class-validator style messages (field names + constraints). Example: "personalInfo.firstName should not be empty" or "program must be an object" depending on what was sent.

Common error responses and how to present them

- 400 with message 'Invalid departmentId' -> show user-friendly: "Please select a valid department."
- 400 with message 'Program does not belong to the specified department' -> show: "Selected program is not available under the chosen department. Please re-select."
- 400 with message 'Course does not belong to the specified program' -> show: "Selected course is not part of the selected program. Please re-select."
- 400 validation errors from DTO -> show a list of field-specific messages returned by the API.

File uploads / documents

- The backend expects `documents` to be simple strings (URLs or storage keys). Use your upload endpoint to upload files first (`/api/upload`) then include the returned URL or key in the `documents` object.
- If your UI uses FormData for other flows, keep the application POST as JSON after uploads complete.

Examples

- Fetch example (browser / React / Next)

const body = /* JSON object as above */;
const res = await fetch('http://localhost:3001/api/admissions/apply', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(body),
});
if (!res.ok) {
  const err = await res.json();
  // display err.message or validation errors
}

- PowerShell example

$body = @{
  departmentId = '...'
  programId = '...'
  courseId = '...'
  academicYear = '2025'
  personalInfo = @{ firstName='Jane'; lastName='Doe'; email='jane@example.com'; phone='+2507...'; dateOfBirth='2000-01-01'; address='...'; nationality='Rwanda' }
  academicInfo = @{ previousEducation='High School'; gpa=3.5; graduationYear=2023; institution='Some High School' }
} | ConvertTo-Json -Depth 6
Invoke-RestMethod -Uri http://localhost:3001/api/admissions/apply -Method Post -Body $body -ContentType 'application/json' -Headers @{ Authorization = 'Bearer <token>' }

Tips & debugging

- If you get a message: "program must be an object" or "course must be an object" it means the DTO expected an object shape; either send `{ program: { id: '...' } }` or send `programId: '...'` instead.
- If you see duplicate application errors while testing, change `academicYear` or check your test user to ensure previous applications are removed.
- Keep selects driven by the backend endpoints above to avoid mismatches; don't hardcode program->course relationships.

Backwards-compatibility note

- The backend accepts both `programId/departmentId/courseId` and nested `program/department/course` objects with `id` fields. Prefer sending IDs for clarity.

If you want, I can also add a small TypeScript interface file snippet or a ready-made React hook example to this doc — tell me which you'd prefer and I will add it.

TypeScript interfaces and React hook example
------------------------------------------

Below are minimal TypeScript interfaces and a small React hook you can drop into your frontend to type the form data and submit it to the backend. The hook handles token injection, basic response parsing and returns a small status object you can wire into your UI.

Types (copy into your frontend types file)

```ts
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // ISO date
  address: string;
  nationality: string;
}

export interface AcademicInfo {
  previousEducation: string;
  gpa: number;
  graduationYear: number;
  institution: string;
}

export interface Documents {
  transcript?: string; // URL
  recommendationLetter?: string; // URL
  personalStatement?: string; // URL or text
  idDocument?: string; // URL
}

export interface ApplicationPayload {
  departmentId?: string;
  programId?: string;
  courseId?: string;
  // Alternative: you can provide nested refs { id: string } in `department`, `program`, `course`.
  academicYear: string;
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  documents?: Documents;
  personalStatement?: string;
}
```

React hook (simple, copyable)

```tsx
import { useState } from 'react';
import type { ApplicationPayload } from './types';

export function useApplyApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  async function submit(payload: ApplicationPayload, token: string) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch('/api/admissions/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        // prefer server-provided message
        const serverMsg = (body && (body.message || body.error)) || res.statusText;
        setError(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg));
        setLoading(false);
        return { ok: false, body };
      }
      setData(body);
      setLoading(false);
      return { ok: true, body };
    } catch (err: any) {
      setError(err?.message || String(err));
      setLoading(false);
      return { ok: false };
    }
  }

  return { submit, loading, error, data } as const;
}
```

Usage notes

- Call programs/courses endpoints to populate selects and send minimal payloads (ids instead of whole objects).
- On validation errors the server returns 400 with messages; display them directly or map them to friendly UI strings.
- Keep upload flow separate: upload files first with `/api/upload` then include URLs in `documents`.

If you'd like, I can also add a short storybook-ready form component or a ready-made React Hook Form integration.