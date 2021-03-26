import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userProviders } from './user.providers';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProfileModule, ConfigModule],
  controllers: [UserController],
  providers: [...userProviders],
})
export class UserModule {}
