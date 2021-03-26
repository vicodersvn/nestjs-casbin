import { INotification } from './notification.interface';

export interface IChannel {
  name: string;
  execute(notification: INotification): Promise<any>;
}
