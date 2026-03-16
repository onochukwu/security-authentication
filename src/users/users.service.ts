import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userDto: { fullName: string; email: string; password: string }) {
    const exists = await this.userModel.findOne({ email: userDto.email });
    if (exists) throw new ConflictException('Email already exists');
    const created = new this.userModel(userDto);
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findAll() {
    return this.userModel.find({}, '-password').exec();
  }

  async approveUser(userId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { status: 'approved' },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async rejectUser(userId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { status: 'rejected' },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deactivateUser(userId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async activateUser(userId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
