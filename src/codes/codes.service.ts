import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import * as crypto from 'crypto';
import { Code } from './schemas/code.schema';
import { UsersService } from '../users/users.service';
import { LogsService } from '../logs/logs.service';
import { Cron } from '@nestjs/schedule';

export type CodeDocument = Code & Document;

@Injectable()
export class CodesService {
  private readonly logger = new Logger(CodesService.name);

  constructor(
    @InjectModel(Code.name) private readonly codeModel: Model<CodeDocument>,
    private readonly usersService: UsersService,
    private readonly logsService: LogsService,
  ) {}

  private generateToken(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
  }


  async generateForUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    await this.codeModel.deleteMany({ user: userId, type: 'user' });

    const token = this.generateToken();
    const expirationHours = Number(process.env.CODE_EXPIRATION_HOURS || 24);
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    const created = await this.codeModel.create({
      user: new Types.ObjectId(userId),
      code: token,
      type: 'user',
      expiresAt,
      used: false,
    });

    return {
      message: 'User code generated successfully',
      code: created.code,
      type: created.type,
      expiresAt: created.expiresAt,
    };
  }


  async generateGuestCode(userId: string, guestName: string, guestPurpose?: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const token = this.generateToken();
    const expirationHours = Number(process.env.CODE_EXPIRATION_HOURS || 24);
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    const created = await this.codeModel.create({
      user: new Types.ObjectId(userId),
      code: token,
      type: 'user_guest',
      guestName,
      guestPurpose: guestPurpose || '',
      expiresAt,
      used: false,
    });

    return {
      message: 'Guest code generated successfully',
      code: created.code,
      type: created.type,
      guestName: created.guestName,
      guestPurpose: created.guestPurpose,
      expiresAt: created.expiresAt,
    };
  }

  async verify(code: string, expectedType: 'user' | 'user_guest', verifiedBy?: string) {
    const found = await this.codeModel.findOne({ code }).populate('user');
    if (!found) throw new NotFoundException('Code not found');
    if (found.used) throw new BadRequestException('Code has already been used');
    if (found.expiresAt < new Date()) throw new BadRequestException('Code has expired');
    if (found.type !== expectedType) {
      throw new BadRequestException(
        `This code is of type "${found.type}", not "${expectedType}"`,
      );
    }

    found.used = true;
    await found.save();

    await this.logsService.create({
      codeId: found._id.toString(),
      userId: (found.user as any)._id.toString(),
      codeType: found.type,
      verifiedBy,
    });

    const response: Record<string, any> = {
      message: 'Code verified successfully',
      type: found.type,
      user: {
        id: (found.user as any)._id,
        fullName: (found.user as any).fullName,
        email: (found.user as any).email,
      },
      verifiedAt: new Date(),
    };

    if (found.type === 'user_guest') {
      response.guest = {
        name: found.guestName,
        purpose: found.guestPurpose,
      };
    }

    return response;
  }


  @Cron('0 */6 * * *')
  async regenerateDailyCodes() {
    this.logger.log('Running code regeneration task...');

    const expiredCodes = await this.codeModel.find({
      expiresAt: { $lt: new Date() },
      type: 'user',
    });

    for (const code of expiredCodes) {
      const userId = (code.user as any)._id || code.user;
      const newCode = await this.generateForUser(userId.toString());
      this.logger.log(`New code for user ${userId}: ${newCode.code}`);
    }

    this.logger.log('Code regeneration completed');
  }
}
