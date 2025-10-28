import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Code } from './schemas/code.schema';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { LogsService } from '../logs/logs.service';
import { Document, Types } from 'mongoose';

export type CodeDocument = Code & Document;


@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Code.name) private codeModel: Model<Code>,
    private usersService: UsersService,
    private logsService: LogsService,
  ) {}

  private generateToken() {
   
    return crypto.randomBytes(3).toString('hex').toUpperCase();
  }

  async generateForUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + (Number(process.env.CODE_EXPIRATION_HOURS || 24) * 60 * 60 * 1000));
    const created = await this.codeModel.create({ user: userId, code: token, expiresAt });
    return { code: created.code, expiresAt: created.expiresAt };
  }

  async verify(code: string, verifiedBy?: string) {
    const found = await this.codeModel.findOne({ code }).populate('user');
    if (!found) throw new NotFoundException('Code not found');
    if (found.used) throw new BadRequestException('Code already used');
    if (found.expiresAt < new Date()) throw new BadRequestException('Code expired');

    found.used = true;
    await found.save();

    await this.logsService.create({
  codeId: found._id.toString(),
  userId: found.user._id.toString(),
  verifiedBy,
});

    return {
      user: { id: found.user._id, fullName: (found.user as any).fullName, email: (found.user as any).email },
      verifiedAt: new Date(),
    };
  }
}