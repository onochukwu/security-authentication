import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('signup')
  async signup(@Body() body: { name: string; email: string; password: string }) {
    const admin = await this.adminService.signup(body.name, body.email, body.password);
    return { message: 'Admin created successfully', admin };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.adminService.login(body.email, body.password);
  }
}
