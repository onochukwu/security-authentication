import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('signup')
   @ApiOperation({ summary: 'Register a new admin' })
  @ApiBody({
    schema: {
      example: {
        name: 'Input admin name',
        email: 'Input email',
        password: 'Input your password',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async signup(@Body() body: { name: string; email: string; password: string }) {
    const admin = await this.adminService.signup(body.name, body.email, body.password);
    return { message: 'Admin created successfully', admin };
  }

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({
    schema: {
      example: {
        email: 'Input email',
        password: 'Input password',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: { email: string; password: string }) {
    return this.adminService.login(body.email, body.password);
  }
}
