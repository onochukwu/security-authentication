import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashed,
    });

    return {
      message: 'Registration submitted. Please wait for admin approval before logging in.',
      userId: user._id,
    };
  }

  async login(dto: LoginDto) {
    const user = (await this.usersService.findByEmail(dto.email)) as User;
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid email or password');

    if (user.status === 'pending') {
      throw new ForbiddenException('Your account is pending admin approval');
    }
    if (user.status === 'rejected') {
      throw new ForbiddenException('Your account has been rejected by the admin');
    }
    if (!user.isActive) {
      throw new ForbiddenException('Your account has been deactivated');
    }

    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}

