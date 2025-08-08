import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    submitContact(contactDto: ContactDto): Promise<{
        success: boolean;
        message: string;
    }>;
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
