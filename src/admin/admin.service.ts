import { Injectable, NotFoundException, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Admin } from './schemas/admin.schema';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private readonly adminModel: Model<Admin>) {}

 
  async signup(name: string, email: string, password: string) {
    const existing = await this.adminModel.findOne({ email });
    if (existing) throw new ConflictException('Admin already exists');

    const hash = await bcrypt.hash(password, 10);

    const admin = await this.adminModel.create({
      name,
      email,
      password: hash,
    });

    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    };
  }

  
  async login(email: string, password: string) {
    const admin = await this.adminModel.findOne({ email });
    if (!admin) throw new NotFoundException('Admin not found');

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: (admin._id as any).toString(),
      email: admin.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    return {
      message: 'Login successful',
      access_token: token,
    };
  }

  
  async findByEmail(email: string) {
    return this.adminModel.findOne({ email });
  }
}
