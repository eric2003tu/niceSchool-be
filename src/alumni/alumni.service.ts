import { Injectable } from '@nestjs/common';

@Injectable()
export class AlumniService {
  async findFeatured() {
    // Mock data - replace with actual database queries
    return [
      {
        id: '1',
        name: 'Sarah Johnson',
        graduationYear: 2018,
        program: 'Computer Science',
        currentPosition: 'Senior Software Engineer at Google',
        image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        story: 'Sarah has been instrumental in developing cutting-edge AI technologies.',
      },
      {
        id: '2',
        name: 'Michael Chen',
        graduationYear: 2019,
        program: 'Business Administration',
        currentPosition: 'CEO at Tech Startup',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        story: 'Michael founded a successful fintech company that serves millions of users.',
      },
    ];
  }

  async findEvents() {
    // Mock alumni events - replace with actual database queries
    return [
      {
        id: '1',
        title: 'Alumni Networking Night',
        date: '2025-02-15',
        location: 'School Auditorium',
        description: 'Connect with fellow alumni and build professional networks.',
        registrationOpen: true,
      },
      {
        id: '2',
        title: 'Career Mentorship Program Launch',
        date: '2025-03-01',
        location: 'Virtual Event',
        description: 'Join our mentorship program to guide current students.',
        registrationOpen: true,
      },
    ];
  }

  async getStats() {
    return {
      totalAlumni: 12500,
      countries: 45,
      industries: [
        { name: 'Technology', percentage: 35 },
        { name: 'Finance', percentage: 25 },
        { name: 'Healthcare', percentage: 20 },
        { name: 'Education', percentage: 15 },
        { name: 'Other', percentage: 5 },
      ],
      employmentRate: 95,
    };
  }

  async getDirectory(page: number = 1, limit: number = 10, search?: string) {
    // Mock directory data - replace with actual database queries
    const mockAlumni = [
      {
        id: '1',
        name: 'Sarah Johnson',
        graduationYear: 2018,
        program: 'Computer Science',
        location: 'San Francisco, CA',
        company: 'Google',
        email: 'sarah.johnson@example.com',
      },
      {
        id: '2',
        name: 'Michael Chen',
        graduationYear: 2019,
        program: 'Business Administration',
        location: 'New York, NY',
        company: 'FinTech Innovations',
        email: 'michael.chen@example.com',
      },
    ];

    return {
      data: mockAlumni,
      total: mockAlumni.length,
      page,
      limit,
    };
  }
}