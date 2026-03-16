import { Controller, Post, Patch, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { AdminGuard } from './admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
  ) {}


  @Post('signup')
  @ApiOperation({ summary: 'Register an admin' })
  @ApiBody({
    schema: {
      example: { name: 'prefered admin name', email: 'prefered admin email', password: 'prefered admin password' },
    },
  })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  async signup(@Body() body: { name: string; email: string; password: string }) {
    const admin = await this.adminService.signup(body.name, body.email, body.password);
    return { message: 'Admin created successfully', admin };
  }

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({
    schema: { example: { email: 'enter admin emain', password: 'enter admin password' } },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: { email: string; password: string }) {
    return this.adminService.login(body.email, body.password);
  }


  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  async listUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Patch('users/:id/approve')
  @ApiOperation({ summary: 'Approve a pending user signup' })
  @ApiParam({ name: 'id', description: 'User MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'User approved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async approveUser(@Param('id') id: string) {
    const user = await this.usersService.approveUser(id);
    return { message: 'User approved successfully', user };
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Patch('users/:id/reject')
  @ApiOperation({ summary: 'Reject a pending user signup' })
  @ApiParam({ name: 'id', description: 'User MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'User rejected' })
  async rejectUser(@Param('id') id: string) {
    const user = await this.usersService.rejectUser(id);
    return { message: 'User rejected', user };
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Patch('users/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user account' })
  @ApiParam({ name: 'id', description: 'User MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'User deactivated' })
  async deactivateUser(@Param('id') id: string) {
    const user = await this.usersService.deactivateUser(id);
    return { message: 'User deactivated successfully', user };
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Patch('users/:id/activate')
  @ApiOperation({ summary: 'Re-activate a deactivated user account' })
  @ApiParam({ name: 'id', description: 'User MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'User activated' })
  async activateUser(@Param('id') id: string) {
    const user = await this.usersService.activateUser(id);
    return { message: 'User activated successfully', user };
  }
}
