import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { SendResetLinkParams, ResetPasswordParams } from '../../validators/forgot-password.validator';
import { UserService } from '../../../user/services/user.service';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { SendResetLinkNotification } from '../../notifications/send-reset-link.notification';
import { ApiResponseService } from '../../../../shared/services/api-response/api-response.service';
import { PasswordResetService } from '../../services/password-reset.service';
import { UserTransformer } from '../../../user/transformers/user.transformer';
import { ConfigService } from '@nestjs/config';
import { ApiBadRequestResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/v1/auth/forgot-password')
export class ForgotPasswordController {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private passwordResetService: PasswordResetService,
    private configService: ConfigService,
    private response: ApiResponseService,
  ) {}

  @Post()
  @ApiOkResponse({ description: 'Email sent' })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  async sendResetLinkEmail(@Body() data: SendResetLinkParams): Promise<any> {
    const { email } = data;
    const user = await this.userService.firstOrFail({
      where: { email: this.userService.sanitizeEmail(email) },
    });
    await this.passwordResetService.expireAllToken(user.email);
    const password_reset = await this.passwordResetService.generate(user.email);
    await this.notificationService.send(user, new SendResetLinkNotification(password_reset, this.configService.get('FONTEND_URL')));
    return this.response.success();
  }

  @Post('reset')
  @ApiOkResponse({ description: 'Email sent' })
  @ApiBadRequestResponse({ description: 'Token is expired' })
  async reset(@Body() data: ResetPasswordParams): Promise<any> {
    const { token, password } = data;
    const password_reset = await this.passwordResetService.firstOrFail({
      where: { token },
    });
    if (this.passwordResetService.isExpired(password_reset)) {
      throw new BadRequestException('Token is expired');
    }
    await this.passwordResetService.expire(token);
    const user = await this.userService.first({
      where: { email: password_reset.email },
    });
    await this.userService.changePassword(user.id, password);
    return this.response.item(user, new UserTransformer());
  }
}
