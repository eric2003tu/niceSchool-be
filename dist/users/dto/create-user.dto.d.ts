import { UserRole } from '../../common/enums/user-role.enum';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    phone?: string;
    dateOfBirth?: Date;
    profileImage?: string;
}
