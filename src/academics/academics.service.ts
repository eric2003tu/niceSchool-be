import { Injectable } from '@nestjs/common';

@Injectable()
export class AcademicsService {
  async getPrograms() {
    return [
      {
        id: '1',
        name: 'Computer Science',
        degree: 'Bachelor of Science',
        duration: '4 years',
        credits: 120,
        description: 'Comprehensive program covering software development, algorithms, and computer systems.',
        courses: ['Programming Fundamentals', 'Data Structures', 'Database Systems', 'Software Engineering'],
      },
      {
        id: '2',
        name: 'Business Administration',
        degree: 'Bachelor of Business Administration',
        duration: '4 years',
        credits: 120,
        description: 'Develop leadership and business skills across various industries.',
        courses: ['Business Management', 'Marketing', 'Finance', 'Operations Management'],
      },
      {
        id: '3',
        name: 'Engineering',
        degree: 'Bachelor of Engineering',
        duration: '4 years',
        credits: 128,
        description: 'Hands-on engineering program with specializations available.',
        courses: ['Engineering Mathematics', 'Physics', 'Materials Science', 'Design Engineering'],
      },
    ];
  }

  async getDepartments() {
    return [
      {
        id: '1',
        name: 'Computer Science & IT',
        head: 'Dr. Sarah Williams',
        faculty: 12,
        students: 450,
        programs: ['Computer Science', 'Information Technology', 'Cybersecurity'],
      },
      {
        id: '2',
        name: 'Business & Economics',
        head: 'Prof. Michael Brown',
        faculty: 15,
        students: 600,
        programs: ['Business Administration', 'Economics', 'Marketing'],
      },
      {
        id: '3',
        name: 'Engineering',
        head: 'Dr. James Davis',
        faculty: 20,
        students: 800,
        programs: ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'],
      },
    ];
  }

  async getCourses(program?: string) {
    const allCourses = [
      {
        id: '1',
        code: 'CS101',
        name: 'Introduction to Programming',
        credits: 3,
        program: 'Computer Science',
        semester: 1,
        prerequisites: [],
      },
      {
        id: '2',
        code: 'CS201',
        name: 'Data Structures & Algorithms',
        credits: 4,
        program: 'Computer Science',
        semester: 3,
        prerequisites: ['CS101'],
      },
      {
        id: '3',
        code: 'BUS101',
        name: 'Business Fundamentals',
        credits: 3,
        program: 'Business Administration',
        semester: 1,
        prerequisites: [],
      },
      {
        id: '4',
        code: 'ENG101',
        name: 'Engineering Mathematics',
        credits: 4,
        program: 'Engineering',
        semester: 1,
        prerequisites: [],
      },
    ];

    if (program) {
      return allCourses.filter(course => 
        course.program.toLowerCase().includes(program.toLowerCase())
      );
    }

    return allCourses;
  }

  async getAcademicCalendar() {
    return {
      currentSemester: 'Spring 2025',
      importantDates: [
        { date: '2025-01-15', event: 'Spring Semester Begins' },
        { date: '2025-03-15', event: 'Mid-term Exams' },
        { date: '2025-03-25', event: 'Spring Break' },
        { date: '2025-05-15', event: 'Final Exams' },
        { date: '2025-05-25', event: 'Graduation Ceremony' },
        { date: '2025-06-01', event: 'Summer Session Begins' },
      ],
      holidays: [
        { date: '2025-02-17', name: 'Presidents Day' },
        { date: '2025-04-18', name: 'Good Friday' },
        { date: '2025-05-26', name: 'Memorial Day' },
      ],
    };
  }
}