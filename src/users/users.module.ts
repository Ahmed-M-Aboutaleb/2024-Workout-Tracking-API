import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IsUserExistsRule } from './validators/rules/IsUserExists';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { PayloadVerifier, TokenExtractor } from '../roles/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    IsUserExistsRule,
    UsersService,
    TokenExtractor,
    PayloadVerifier,
    JwtService,
  ],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
