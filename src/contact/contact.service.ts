import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContactService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async submitContact(contactDto: ContactDto): Promise<{ success: boolean; message: string }> {
    try {
      // Send email notification
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to: 'admissions@niceschool.edu', // Replace with actual contact email
        subject: `Contact Form: ${contactDto.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${contactDto.firstName} ${contactDto.lastName}</p>
          <p><strong>Email:</strong> ${contactDto.email}</p>
          <p><strong>Phone:</strong> ${contactDto.phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${contactDto.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${contactDto.message}</p>
        `,
      });

      // Send auto-reply to user
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to: contactDto.email,
        subject: 'Thank you for contacting Nice School',
        html: `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${contactDto.firstName},</p>
          <p>We have received your message and will get back to you within 24-48 hours.</p>
          <p>Your message:</p>
          <blockquote>${contactDto.message}</blockquote>
          <p>Best regards,<br>Nice School Team</p>
        `,
      });

      return {
        success: true,
        message: 'Your message has been sent successfully!',
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        message: 'Failed to send message. Please try again later.',
      };
    }
  }

  getContactInfo() {
    return {
      address: '123 Education Street, Learning City, LC 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@niceschool.edu',
      hours: {
        monday_friday: '8:00 AM - 6:00 PM',
        saturday: '9:00 AM - 2:00 PM',
        sunday: 'Closed',
      },
      departments: [
        {
          name: 'Admissions',
          email: 'admissions@niceschool.edu',
          phone: '+1 (555) 123-4567',
        },
        {
          name: 'Academic Affairs',
          email: 'academics@niceschool.edu',
          phone: '+1 (555) 123-4568',
        },
        {
          name: 'Student Services',
          email: 'students@niceschool.edu',
          phone: '+1 (555) 123-4569',
        },
      ],
    };
  }
}