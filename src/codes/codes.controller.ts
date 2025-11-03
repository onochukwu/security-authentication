import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CodesService } from './codes.service';
import { UsersService } from '../users/users.service';
import { AdminGuard } from '../admin/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Codes') 
@Controller('codes')
export class CodesController {
  constructor(
    private readonly codesService: CodesService,
    private readonly usersService: UsersService,
  ) {}

  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('generate')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Login with user token to generate a new verification code (User only)' })
  @ApiResponse({ status: 201, description: 'Code generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid or missing token' })
  async generate(@Req() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) return { message: 'User not found' };

    const code = await this.codesService.generateForUser(user._id.toString());
    return code;
  }

 
  @UseGuards(AdminGuard)
  @Post('verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log in with admin token to verify a user code (Admin only)' })
  @ApiBody({
    schema: {
      example: {
        code: 'input code',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Code verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid code or user not found' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin access required' })
  async verify(@Body() body: { code: string }, @Req() req) {
    const admin = req.admin;
    return this.codesService.verify(body.code, admin.email);
  }
}
