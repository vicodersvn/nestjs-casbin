/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApiResponseService } from './services/api-response/api-response.service';
import { Module, Global } from '@nestjs/common';
import { HashService } from './services/hash/hash.service';
import { NotificationModule } from './services/notification/notification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailChannel } from './services/notification/channels/email/email.channel';

@Global()
@Module({
  imports: [
    NotificationModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        channels: [
          EmailChannel.config({
            host: configService.get('MAIL_HOST'),
            port: configService.get('MAIL_PORT'),
            secure: Number(configService.get('MAIL_PORT')) === 465,
            auth: {
              user: configService.get('MAIL_USERNAME'),
              pass: configService.get('MAIL_PASSWORD'),
            },
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ApiResponseService, HashService],
  exports: [ApiResponseService, HashService],
})
export class SharedModule {}
