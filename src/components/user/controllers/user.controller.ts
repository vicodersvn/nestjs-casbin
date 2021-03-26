import { UserService } from '../services/user.service';
import { Controller, Get, Param, ParseIntPipe, Query, Post, Body, Put, Req, BadRequestException } from '@nestjs/common';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { UserTransformer } from '../transformers/user.transformer';
import { UserRepository } from '../repositories/user.repository';
import { getCustomRepository } from 'typeorm';
import { isNil, includes, pick, isBoolean } from 'lodash';
import { IPaginationOptions } from '../../../shared/services/pagination';
import { Auth } from '../../auth/decorators/auth.decorator';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { AdminCreateUserBodyParam, AdminChangeUserBodyParam, UserSendMailReportParams } from './user.validator';
import { ConfigService } from '@nestjs/config';
import { VerifyUserNotification } from '../notifications/verify-user.notification';
import { UserPasswordChangedNotification } from '../notifications/user-password-changed.notification';
import { InviteUserService } from '../services/invite-user.service';
import { SendInviteUserLinkNotification } from '../../auth/notifications/send-invite-user-link.notification';
import { FindManyQueryParams } from '../../../shared/validators/find-many-query-params.validator';
import { Request } from 'express';
import { UserSendMailReportNotification } from '../notifications/user-send-email-report.notification';
import { AuthenticatedUser } from '../../auth/decorators/authenticated-user.decorator';
import { User } from '../entities/user.entity';
import { map, isEmpty } from 'lodash';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/v1/users')
export class UserController {
  constructor(
    private userService: UserService,
    private response: ApiResponseService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    private inviteUserService: InviteUserService,
  ) {}

  @Get()
  @Auth('admin', 'user')
  async index(@AuthenticatedUser() user: User, @Query() query: { per_page: number; page: number; includes?: string }, @Query() request: FindManyQueryParams): Promise<any> {
    let relations = [];
    const params: IPaginationOptions = {
      limit: query.per_page ? query.per_page : 10,
      page: query.page ? query.page : 1,
    };
    let query_buidler = getCustomRepository(UserRepository).createQueryBuilder('user');
    const user_roles = map(user.roles, (r) => r.slug);
    if (includes(user_roles, 'user') || isEmpty(user_roles)) {
      query_buidler = getCustomRepository(UserRepository).createQueryBuilder('user').where('user.id = :id', { id: user.id });
    }
    if (request.search && request.search !== '') {
      query_buidler = query_buidler.andWhere('email LIKE :keyword', {
        keyword: `%${request.search}%`,
      });
    }
    if (!isNil(query.includes) && query.includes !== '') {
      relations = query.includes.split(',');
      if (includes(relations, 'roles')) {
        query_buidler = query_buidler.leftJoinAndSelect('user.roles', 'role');
      }
    }

    const data = await this.userService.paginate(query_buidler, params);
    return this.response.paginate(data, new UserTransformer(relations));
  }

  @Get(':id')
  @Auth('admin', 'user')
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const item = await this.userService.find(id, { relations: ['roles'] });
    return this.response.item(item, new UserTransformer(['roles']));
  }

  @Post()
  @Auth('admin')
  async store(@Body() data: AdminCreateUserBodyParam): Promise<any> {
    const item = await this.userService.create(pick(data, ['email', 'password', 'first_name', 'last_name']));
    return this.response.item(item, new UserTransformer());
  }

  @Put(':id/password')
  @Auth('admin')
  async changePassword(@Param('id', ParseIntPipe) id: number, @Body() data: AdminChangeUserBodyParam): Promise<any> {
    const user = await this.userService.findOrFail(id);
    await this.userService.update(user.id, {
      password: this.userService.hashPassword(data.password),
    });
    if (isBoolean(data.notify_user) && data.notify_user === true) {
      this.notificationService.send(user, new UserPasswordChangedNotification(data.password));
    }
    return this.response.success();
  }

  @Post(':id/send-verify-link')
  @Auth('admin')
  async sendVerifyLink(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const user = await this.userService.findOrFail(id);
    await this.userService.generateVerifyToken(user.id);
    this.notificationService.send(user, new VerifyUserNotification(user.generateVerifyEmailLink(this.configService.get('FONTEND_URL'))));
    return this.response.success();
  }

  @Post(':id/verify')
  async verify(@Query('token') token: string): Promise<any> {
    const user = await this.userService.firstOrFail({
      where: { verify_token: token, verified: false, verified_at: null },
    });
    const result = await this.userService.verify(user.id);
    return this.response.item(result, new UserTransformer());
  }

  @Post('invite')
  @Auth('admin')
  async inviteUser(@Req() request: Request): Promise<any> {
    const data = (request as any).body;
    const check = await this.userService.isExisting(data.email);
    if (check) {
      throw new BadRequestException('User is exist in system');
    }
    const item = await this.userService.create(pick(data, ['email']));
    await this.inviteUserService.expireAllToken(item.email);
    const password_reset = await this.inviteUserService.generate(item.email);
    await this.notificationService.send(item, new SendInviteUserLinkNotification(password_reset, this.configService.get('FONTEND_URL')));
    return this.response.success();
  }

  @Post(':id/attach-role')
  @Auth('admin')
  async attachRole(@Req() request: Request): Promise<any> {
    const userId = (request as any).params.id;
    const roleId = (request as any).body.role_id;
    await this.userService.attachRole(userId, roleId);
    return this.response.success();
  }

  @Post(':id/dettach-role')
  @Auth('admin')
  async dettachRole(@Req() request: Request): Promise<any> {
    const userId = (request as any).params.id;
    const roleId = (request as any).body.role_id;
    await this.userService.dettachRole(userId, roleId);
    return this.response.success();
  }

  @Post(':id/send-mail')
  @Auth('admin')
  async sendMail(@Body() params: UserSendMailReportParams, @Req() request: Request, @Param('id', ParseIntPipe) id: number): Promise<any> {
    const user = await this.userService.findOrFail(id);

    const data = (request as any).body;
    this.notificationService.send(user, new UserSendMailReportNotification(data.toEmail, data.linkReport));
    return this.response.success();
  }
}
