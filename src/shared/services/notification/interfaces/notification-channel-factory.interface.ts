import { IChannel } from './channel.interface';

export interface INotificationChannelFactory {
  registerChannel(): Promise<IChannel[]> | IChannel[] | [];
}
