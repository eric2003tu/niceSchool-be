import { ContactDto } from './dto/contact.dto';
import { ConfigService } from '@nestjs/config';
export declare class ContactService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    submitContact(contactDto: ContactDto): Promise<{
        success: boolean;
        message: string;
    }>;
    sendMail(options: any): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    getContactInfo(): {
        address: string;
        phone: string;
        email: string;
        hours: {
            monday_friday: string;
            saturday: string;
            sunday: string;
        };
        departments: {
            name: string;
            email: string;
            phone: string;
        }[];
    };
}
