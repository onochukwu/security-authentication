import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user (requires admin approval before login)' })
  @ApiBody({
    schema: {
      example: {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Registration submitted. Awaiting admin approval.' })
  @ApiResponse({ status: 400, description: 'Email already in use' })
  async signup(@Body() body: { fullName: string; email: string; password: string }) {
    return this.authService.signup(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password (approved users only)' })
  @ApiBody({
    schema: {
      example: {
        email: 'john@example.com',
        password: 'password123',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account pending, rejected, or deactivated' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }
}
