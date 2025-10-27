<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).



readme file for olera security API


# OLERA — NestJS Backend Starter

This document contains a complete starter scaffold for the OLERA backend using **NestJS + MongoDB + JWT**. Copy each file into your project `olera-backend` folder (or clone/recreate using the commands below).

---

## Quick setup (commands)

```bash
# 1. Install Nest CLI if you haven't
npm i -g @nestjs/cli

# 2. Create project
nest new olera-backend
cd olera-backend

# 3. Install dependencies
npm install @nestjs/mongoose mongoose @nestjs/jwt passport passport-jwt bcrypt dotenv
npm install --save-dev @types/bcrypt

# 4. Create folders (optional if using CLI generators shown later)
mkdir src/users src/auth src/codes src/logs src/common
```

---

## .env.example

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/olera
JWT_SECRET=supersecretkey
JWT_EXPIRATION=3600s
CODE_EXPIRATION_HOURS=24
```

Copy to `.env` and adjust values.

---

## package.json (important scripts)

Add or confirm these scripts in `package.json`:

```json
"scripts": {
  "start": "nest start",
  "start:dev": "nest start --watch",
  "build": "nest build"
}
```

---

## tsconfig.json

Use the default created by NestJS CLI.

---

# Project file contents

Below are the key files — create them under `src/`.

---

### src/main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`OLERA backend running on http://localhost:${port}`);
}
bootstrap();
```

---

### src/app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CodesModule } from './codes/codes.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/olera'),
    UsersModule,
    AuthModule,
    CodesModule,
    LogsModule,
  ],
})
export class AppModule {}
```

---

# Users module

### src/users/schemas/user.schema.ts

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // hashed
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### src/users/users.module.ts

```typescript
 
```

### src/users/users.service.ts

```typescript
import { Injectable, ConflictException } from '@nestjs/common';
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
}
```

### src/users/users.controller.ts (minimal)

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
```

---

# Auth module

### src/auth/auth.module.ts

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '3600s' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### src/auth/auth.service.ts

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signup(dto: { fullName: string; email: string; password: string }) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({ ...dto, password: hashed });
    return { id: user._id, email: user.email };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user._id.toString(), email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
```

### src/auth/auth.controller.ts

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: { fullName: string; email: string; password: string }) {
    return this.authService.signup(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }
}
```

### src/auth/jwt.strategy.ts

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecretkey',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

---

# Codes module (core of OLERA)

### src/codes/schemas/code.schema.ts

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Code extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  code: string; // store plain for this starter; consider hashing in production

  @Prop({ default: false })
  used: boolean;

  @Prop()
  expiresAt: Date;
}

export const CodeSchema = SchemaFactory.createForClass(Code);
```

### src/codes/codes.module.ts

```typescript
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
```

### src/codes/codes.service.ts

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Code } from './schemas/code.schema';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Code.name) private codeModel: Model<Code>,
    private usersService: UsersService,
    private logsService: LogsService,
  ) {}

  private generateToken() {
    // 6-character alphanumeric
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

    // create verification log
    await this.logsService.create({ codeId: found._id, userId: found.user._id, verifiedBy });

    return {
      user: { id: found.user._id, fullName: (found.user as any).fullName, email: (found.user as any).email },
      verifiedAt: new Date(),
    };
  }
}
```

### src/codes/codes.controller.ts

```typescript
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CodesService } from './codes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('codes')
export class CodesController {
  constructor(private codesService: CodesService) {}

  // Generate a code for the logged-in user
  @UseGuards(AuthGuard('jwt'))
  @Post('generate')
  async generate(@Req() req: any) {
    const userId = req.user.userId;
    return this.codesService.generateForUser(userId);
  }

  // Admin / security verifies a code. This endpoint can be public or protected depending on your flow.
  @Post('verify')
  async verify(@Body() body: { code: string; verifiedBy?: string }) {
    return this.codesService.verify(body.code, body.verifiedBy || 'anonymous');
  }
}
```

---

# Logs module (stores verification records)

### src/logs/schemas/log.schema.ts

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Log extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Code', required: true })
  codeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  verifiedBy: string;

  @Prop()
  verifiedAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
```

### src/logs/logs.module.ts

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './schemas/log.schema';
import { LogsService } from './logs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
```

### src/logs/logs.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async create(payload: { codeId: string; userId: string; verifiedBy?: string }) {
    const entry = new this.logModel({
      codeId: payload.codeId,
      userId: payload.userId,
      verifiedBy: payload.verifiedBy || 'unknown',
      verifiedAt: new Date(),
    });
    return entry.save();
  }

  async findAll() {
    return this.logModel.find().populate('userId').populate('codeId');
  }
}
```

---

# Notes & Next steps

1. **Hashing codes:** In production, you should store a hash of the code (not plaintext) and compare hashes on verification to improve security.
2. **Rate-limiting / brute-force protection:** Add rate limits to `verify` endpoint.
3. **Role-based access:** Add roles (admin, security) and protect `verify` endpoint as you need.
4. **Frontend:** After backend is running you can create a React/React Native client for users and a separate admin web UI for security.
5. **Unit tests / e2e tests:** Use Nest testing utilities to add tests.

---

# README (quick)

```md
# OLERA Backend (starter)

## Run

1. Copy `.env.example` to `.env` and set MONGO_URI, JWT_SECRET.
2. Install dependencies: `npm install`.
3. Start the server: `npm run start:dev`.

## Endpoints
- POST /auth/signup { fullName, email, password }
- POST /auth/login { email, password } -> returns access_token
- POST /codes/generate (protected, Bearer token)
- POST /codes/verify { code, verifiedBy? }
- GET /users/:id

```

---
