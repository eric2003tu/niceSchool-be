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
exports.FacultyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FacultyService = class FacultyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFacultyDto) {
        const _a = createFacultyDto, { department } = _a, rest = __rest(_a, ["department"]);
        const payload = Object.assign({}, rest);
        if (department)
            payload.department = { connect: { id: department } };
        return this.prisma.faculty.create({ data: payload });
    }
    async findAll(page = 1, limit = 10, department, search) {
        const where = { isActive: true };
        if (department && department !== 'all') {
            where.departmentId = department;
        }
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { position: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.faculty.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.faculty.count({ where }),
        ]);
        return { data, total, page, limit };
    }
    async findOne(id) {
        const faculty = await this.prisma.faculty.findUnique({
            where: { id },
        });
        if (!faculty || !faculty.isActive) {
            throw new common_1.NotFoundException('Faculty member not found');
        }
        return faculty;
    }
    async findByDepartment(department) {
        return this.prisma.faculty.findMany({
            where: { departmentId: department, isActive: true },
        });
    }
    async update(id, updateFacultyDto) {
        const _a = updateFacultyDto, { department } = _a, rest = __rest(_a, ["department"]);
        const payload = Object.assign({}, rest);
        if (department)
            payload.department = { connect: { id: department } };
        return this.prisma.faculty.update({
            where: { id },
            data: payload,
        });
    }
    async remove(id) {
        await this.prisma.faculty.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getDepartments() {
        const departments = await this.prisma.faculty.findMany({
            where: { isActive: true },
            select: { departmentId: true },
            distinct: ['departmentId'],
        });
        return departments.map(dept => dept.departmentId);
    }
};
exports.FacultyService = FacultyService;
exports.FacultyService = FacultyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FacultyService);
//# sourceMappingURL=faculty.service.js.map