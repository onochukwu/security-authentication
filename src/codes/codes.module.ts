import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';
import { Code, CodeSchema } from './schemas/code.schema';
import { LogsModule } from '../logs/logs.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module'; 
import { AdminGuard } from '../admin/admin.guard'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Code.name, schema: CodeSchema }]),
    LogsModule,
    UsersModule,
    AuthModule, 
  ],
  providers: [CodesService, AdminGuard], 
  controllers: [CodesController],
  exports: [CodesService],
})
export class CodesModule {}
