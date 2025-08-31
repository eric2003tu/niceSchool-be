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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const contact_service_1 = require("../contact/contact.service");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(usersService, jwtService, prisma, configService, contactService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.configService = configService;
        this.contactService = contactService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password: _ } = user, result = __rest(user, ["password"]);
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isActive)
            throw new common_1.UnauthorizedException('Account is deactivated');
        await this.usersService.updateLastLogin(user.id);
        const payload = { email: user.email, sub: user.id, userId: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '600m',
            }),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profileImage: user.profileImage,
            },
        };
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser)
            throw new common_1.UnauthorizedException('User already exists');
        const user = await this.usersService.create(registerDto);
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        const payload = {
            email: user.email,
            sub: user.id,
            userId: user.id,
            role: user.role,
            phone: user.phone,
            profileImage: user.profileImage,
            dateOfBirth: user.dateOfBirth,
        };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.JWT_EXPIRATION_TIME || '15m',
            }),
            user: userWithoutPassword,
        };
    }
    async requestPasswordReset(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return { success: true };
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
        await this.prisma.passwordResetToken.create({
            data: { userId: user.id, token, expiresAt },
        });
        const resetBase = this.configService.get('FRONTEND_URL') || this.configService.get('APP_URL') || '';
        const resetLink = `${resetBase}/reset-password?token=${token}`;
        try {
            await this.contactService.sendMail({
                from: this.configService.get('EMAIL_USER'),
                to: user.email,
                subject: 'Password reset request',
                html: `<p>Hi ${user.firstName || ''},</p><p>Use the link below to reset your password. The link expires in 1 hour.</p><p><a href="${resetLink}">Reset password</a></p>`,
            });
        }
        catch (err) {
            console.error('Failed to send password reset email', err);
        }
        return { success: true };
    }
    async resetPassword(token, newPassword) {
        const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });
        if (!record)
            throw new common_1.BadRequestException('Invalid or expired token');
        if (record.expiresAt < new Date()) {
            await this.prisma.passwordResetToken.delete({ where: { id: record.id } });
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({ where: { id: record.userId }, data: { password: hashed } });
        await this.prisma.passwordResetToken.delete({ where: { id: record.id } });
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        config_1.ConfigService,
        contact_service_1.ContactService])
], AuthService);
//# sourceMappingURL=auth.service.js.map