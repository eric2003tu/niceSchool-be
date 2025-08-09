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
        let prismaRole = client_1.$Enums.UserRole.STUDENT;
        if (createUserDto.role && Object.values(client_1.$Enums.UserRole).includes(createUserDto.role)) {
            prismaRole = createUserDto.role;
        }
        try {
            return await this.prisma.user.create({
                data: Object.assign(Object.assign({}, createUserDto), { role: prismaRole, password: hashedPassword }),
            });
        }
        catch (error) {
            if (error.code === 'P2002' && ((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            console.error('User creation error:', error);
            throw new common_1.InternalServerErrorException('Failed to create user');
        }
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                profileImage: true,
            },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                profileImage: true,
                phone: true,
                dateOfBirth: true,
                isActive: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        let prismaRole = undefined;
        if (updateUserDto.role && Object.values(client_1.$Enums.UserRole).includes(updateUserDto.role)) {
            prismaRole = updateUserDto.role;
        }
        const updateData = Object.assign({}, updateUserDto);
        if (prismaRole) {
            updateData.role = prismaRole;
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(id) {
        await this.prisma.user.delete({ where: { id } });
    }
    async updateLastLogin(id) {
        await this.prisma.user.update({
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