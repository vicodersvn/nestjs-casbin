import { ApiResponseService } from './api-response/api-response.service';
import { Module, Global } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { NotificationModule } from './notification/notification.module';

@Global()
@Module({
  providers: [ApiResponseService, HashService],
  exports: [ApiResponseService],
  imports: [NotificationModule],
})
export class ServicesModule {}
