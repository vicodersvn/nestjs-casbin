import { INotificationChannelFactory, IChannel } from './interfaces';

export class NotificationChannelFactory implements INotificationChannelFactory {
  registerChannel(): IChannel[] | [] {
    return [];
  }
}
