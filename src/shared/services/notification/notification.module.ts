import { NotificationService } from './notification.service';
import { NotificationAsyncOptions, INotificationChannelFactory } from './interfaces';
import { Global, Module, DynamicModule, Provider } from '@nestjs/common';
import { NOTIFICATION_OPTIONS, NOTIFICATION_CHANNELS } from './constants';

export const channelFactory = {
  provide: NOTIFICATION_CHANNELS,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  useFactory: async (notificationService) => {
    return notificationService.register();
  },
  inject: [NotificationService],
};

@Global()
@Module({
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {
  public static registerAsync(options: NotificationAsyncOptions): DynamicModule {
    return {
      module: NotificationModule,
      imports: options.imports || [],
      providers: [this.createConnectOptionsProvider(options), channelFactory, NotificationService],
      exports: [NotificationService, channelFactory],
    };
  }

  private static createConnectOptionsProvider(options: NotificationAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: NOTIFICATION_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: NOTIFICATION_OPTIONS,
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      useFactory: async (optionsFactory: INotificationChannelFactory) => await optionsFactory.registerChannel(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
