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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        var _a, _b;
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        let prismaRole = client_1.Role.STUDENT;
        if (createUserDto.role && Object.values(client_1.Role).includes(createUserDto.role)) {
            prismaRole = createUserDto.role;
        }
        try {
            return await this.prisma.account.create({
                data: {
                    email: createUserDto.email,
                    passwordHash: hashedPassword,
                    role: prismaRole,
                    status: client_1.AccountStatus.ACTIVE,
                    profile: {
                        create: {
                            firstName: createUserDto.firstName,
                            lastName: createUserDto.lastName,
                            displayName: `${createUserDto.firstName} ${createUserDto.lastName}`,
                            avatarUrl: createUserDto.profileImage,
                            dateOfBirth: createUserDto.dateOfBirth,
                        },
                    },
                    phone: createUserDto.phone,
                },
            });
        }
        catch (error) {
            if (error.code === 'P2002' && ((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
                throw new common_1.ConflictException('Account with this email already exists');
            }
            console.error('Account creation error:', error);
            throw new common_1.InternalServerErrorException('Failed to create account');
        }
    }
    async findAll() {
        const accounts = await this.prisma.account.findMany({ include: { profile: true } });
        return accounts.map((_a) => {
            var { passwordHash, profile } = _a, rest = __rest(_a, ["passwordHash", "profile"]);
            return (Object.assign(Object.assign({}, rest), { firstName: profile === null || profile === void 0 ? void 0 : profile.firstName, lastName: profile === null || profile === void 0 ? void 0 : profile.lastName, profileImage: profile === null || profile === void 0 ? void 0 : profile.avatarUrl, dateOfBirth: profile === null || profile === void 0 ? void 0 : profile.dateOfBirth }));
        });
    }
    async findOne(id) {
        const account = await this.prisma.account.findUnique({
            where: { id },
            include: { profile: true },
        });
        if (!account) {
            throw new common_1.NotFoundException('Account not found');
        }
        const { passwordHash, profile } = account, rest = __rest(account, ["passwordHash", "profile"]);
        return Object.assign(Object.assign({}, rest), { firstName: profile === null || profile === void 0 ? void 0 : profile.firstName, lastName: profile === null || profile === void 0 ? void 0 : profile.lastName, profileImage: profile === null || profile === void 0 ? void 0 : profile.avatarUrl, dateOfBirth: profile === null || profile === void 0 ? void 0 : profile.dateOfBirth });
    }
    async findByEmail(email, withProfile = false) {
        return this.prisma.account.findUnique({
            where: { email },
            include: withProfile ? { profile: true } : undefined,
        });
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        let prismaRole = undefined;
        if (updateUserDto.role && Object.values(client_1.Role).includes(updateUserDto.role)) {
            prismaRole = updateUserDto.role;
        }
        const updateData = Object.assign({}, updateUserDto);
        if (prismaRole) {
            updateData.role = prismaRole;
        }
        return this.prisma.account.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id) {
        await this.prisma.account.delete({ where: { id } });
    }
    async updateLastLogin(id) {
        await this.prisma.account.update({
            where: { id },
            data: { lastLogin: new Date() },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map