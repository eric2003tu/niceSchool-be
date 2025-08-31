import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ContactService } from '../contact/contact.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private prisma;
    private configService;
    private contactService;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService, configService: ConfigService, contactService: ContactService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            profileImage: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: any;
    }>;
    requestPasswordReset(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
    }>;
}
