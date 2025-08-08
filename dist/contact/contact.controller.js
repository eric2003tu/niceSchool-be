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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contact_service_1 = require("./contact.service");
const contact_dto_1 = require("./dto/contact.dto");
let ContactController = class ContactController {
    constructor(contactService) {
        this.contactService = contactService;
    }
    submitContact(contactDto) {
        return this.contactService.submitContact(contactDto);
    }
    getContactInfo() {
        return this.contactService.getContactInfo();
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit contact form' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_dto_1.ContactDto]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "submitContact", null);
__decorate([
    (0, common_1.Get)('info'),
    (0, swagger_1.ApiOperation)({ summary: 'Get contact information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "getContactInfo", null);
exports.ContactController = ContactController = __decorate([
    (0, swagger_1.ApiTags)('contact'),
    (0, common_1.Controller)('contact'),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map