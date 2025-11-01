import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CodesModule } from './codes/codes.module';
import { LogsModule } from './logs/logs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/olera'),
    UsersModule,
    AuthModule,
    CodesModule,
    LogsModule,
    ScheduleModule.forRoot(),
    AdminModule,
  ],
})
export class AppModule {}