import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Code, CodeSchema } from './schemas/code.schema';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';
import { UsersModule } from '../users/users.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Code.name, schema: CodeSchema }]),
    UsersModule,
    LogsModule,
  ],
  providers: [CodesService],
  controllers: [CodesController],
})
export class CodesModule {}