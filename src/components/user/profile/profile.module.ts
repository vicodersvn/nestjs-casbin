import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { userProviders } from '../user.providers';

@Module({
  controllers: [ProfileController],
  imports: [],
  providers: [...userProviders],
})
export class ProfileModule {}
