import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Submit contact form' })
  submitContact(@Body() contactDto: ContactDto) {
    return this.contactService.submitContact(contactDto);
  }

  @Get('info')
  @ApiOperation({ summary: 'Get contact information' })
  getContactInfo() {
    return this.contactService.getContactInfo();
  }
}