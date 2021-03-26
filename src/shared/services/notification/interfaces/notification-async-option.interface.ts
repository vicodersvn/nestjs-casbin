/* Dependencies */
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/* Interfaces */
import { INotificationChannelFactory } from './notification-channel-factory.interface';
import { NotificationOptions } from './notification-option.interface';

export interface NotificationAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<INotificationChannelFactory>;
  useClass?: Type<INotificationChannelFactory>;
  useFactory?: (...args: any[]) => Promise<NotificationOptions> | NotificationOptions;
}
