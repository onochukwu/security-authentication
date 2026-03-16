import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CodesService } from './codes.service';
import { UsersService } from '../users/users.service';
import { AdminGuard } from '../admin/admin.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Generate a verification code for the logged-in user (User only)' })
  @ApiResponse({ status: 201, description: 'Code generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generate(@Req() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) return { message: 'User not found' };
    return this.codesService.generateForUser(user._id.toString());
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('generate-guest')
  @ApiOperation({
    summary: 'Request a guest code (User only). Provide guest name; purpose is optional.',
  })
  @ApiBody({
    schema: {
      example: {
        guestName: 'Jane Doe',
        guestPurpose: 'Site visit on behalf of ABC Corp',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Guest code generated successfully' })
  @ApiResponse({ status: 400, description: 'guestName is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateGuest(
    @Body() body: { guestName: string; guestPurpose?: string },
    @Req() req,
  ) {
    if (!body.guestName || !body.guestName.trim()) {
      return { message: 'guestName is required' };
    }
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) return { message: 'User not found' };
    return this.codesService.generateGuestCode(
      user._id.toString(),
      body.guestName.trim(),
      body.guestPurpose?.trim(),
    );
  }


  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Post('verify/user')
  @ApiOperation({ summary: 'Admin verifies a user code (type: user)' })
  @ApiBody({ schema: { example: { code: 'ABC123' } } })
  @ApiResponse({ status: 200, description: 'User code verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid, expired, or already-used code' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async verifyUser(@Body() body: { code: string }, @Req() req) {
    return this.codesService.verify(body.code, 'user', req.admin?.email);
  }


  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Post('verify/guest')
  @ApiOperation({ summary: 'Admin verifies a user-guest code (type: user_guest)' })
  @ApiBody({ schema: { example: { code: 'DEF456' } } })
  @ApiResponse({ status: 200, description: 'Guest code verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid, expired, or already-used code' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async verifyGuest(@Body() body: { code: string }, @Req() req) {
    return this.codesService.verify(body.code, 'user_guest', req.admin?.email);
  }
}
