import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CodesService } from './codes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('codes')
export class CodesController {
  constructor(private codesService: CodesService) {}

  // Generate a code for the logged-in user
  @UseGuards(AuthGuard('jwt'))
  @Post('generate')
  async generate(@Req() req: any) {
    const userId = req.user.userId;
    return this.codesService.generateForUser(userId);
  }

  // Admin / security verifies a code. This endpoint can be public or protected depending on your flow.
  @Post('verify')
  async verify(@Body() body: { code: string; verifiedBy?: string }) {
    return this.codesService.verify(body.code, body.verifiedBy || 'anonymous');
  }
}