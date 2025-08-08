"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let ContactService = class ContactService {
    constructor(configService) {
        this.configService = configService;
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
    async submitContact(contactDto) {
        try {
            await this.transporter.sendMail({
                from: this.configService.get('EMAIL_USER'),
                to: 'admissions@niceschool.edu',
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
        }
        catch (error) {
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
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ContactService);
//# sourceMappingURL=contact.service.js.map