import { Controller, Get, UseGuards, Req, Post, Body, Put, BadRequestException } from '@nestjs/common';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { UserService } from '../services/user.service';
import { UserTransformer } from '../transformers/user.transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { HashService } from '../../../shared/services/hash/hash.service';
import { UpdateProfileParams, UpdatePasswordParams } from './profile.validator';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/profile')
export class ProfileController {
  constructor(private response: ApiResponseService, private userService: UserService, private hashService: HashService) {}

  @Get()
  async profile(@Req() request: Request): Promise<any> {
    const user_id = (request as any).user.id;
    const user = await this.userService.find(user_id, { relations: ['roles'] });
    return this.response.item(user, new UserTransformer(['roles']));
  }

  @Post()
  async updateProfile(@Req() request: Request, @Body() body: UpdateProfileParams): Promise<any> {
    const user_id = (request as any).user.id;
    const data: any = {};
    if (body.username) {
      data.username = body.username;
    }
    if (body.first_name) {
      data.first_name = body.first_name;
    }
    if (body.last_name) {
      data.last_name = body.last_name;
    }
    const user = await this.userService.update(user_id, data);
    return this.response.item(user, new UserTransformer());
  }

  @Put('password')
  async changePassword(@Req() request: Request, @Body() body: UpdatePasswordParams): Promise<any> {
    const user = (request as any).user;
    const { password, old_password } = body;
    if (!this.hashService.check(old_password, user.password)) {
      throw new BadRequestException('Old password is not correct');
    }
    const hashed = this.hashService.hash(password);
    const result = await this.userService.update(user.id, { password: hashed });
    return this.response.item(result, new UserTransformer());
  }
}
