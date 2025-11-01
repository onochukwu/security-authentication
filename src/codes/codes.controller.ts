import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CodesService } from './codes.service';
import { UsersService } from '../users/users.service';
import { AdminGuard } from '../admin/admin.guard';

@Controller('codes')
export class CodesController {
  constructor(
    private readonly codesService: CodesService,
    private readonly usersService: UsersService,
  ) {}

 
  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@Req() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) return { message: 'User not found' };

    const code = await this.codesService.generateForUser(user._id.toString());
    return code;
  }

  @UseGuards(AdminGuard)
  @Post('verify')
  async verify(@Body() body: { code: string }, @Req() req) {
    const admin = req.admin; 
    return this.codesService.verify(body.code, admin.email);
  }
}
