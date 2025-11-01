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
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // e.g. 'A1B2C3'
  }

  
  async generateForUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    
    await this.codeModel.deleteMany({ user: userId });

    const token = this.generateToken();
    const expirationHours = Number(process.env.CODE_EXPIRATION_HOURS || 24);
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    const created = await this.codeModel.create({
      user: new Types.ObjectId(userId),
      code: token,
      expiresAt,
      used: false,
    });

    return {
      message: 'Code generated successfully',
      code: created.code,
      expiresAt: created.expiresAt,
    };
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
      userId: (found.user as any)._id.toString(),
      verifiedBy,
    });

    return {
      message: 'Code verified successfully',
      user: {
        id: (found.user as any)._id,
        fullName: (found.user as any).fullName,
        email: (found.user as any).email,
      },
      verifiedAt: new Date(),
    };
  }

  
  @Cron('0 */6 * * *') // every 6 hours
  async regenerateDailyCodes() {
    this.logger.log('Running code regeneration task...');

    const expiredCodes = await this.codeModel.find({
      expiresAt: { $lt: new Date() },
    });

    for (const code of expiredCodes) {
      const userId = (code.user as any)._id || code.user;
      const newCode = await this.generateForUser(userId);
      this.logger.log(`New code generated for user ${userId}: ${newCode.code}`);
    }

    this.logger.log('Code regeneration completed');
  }
}
