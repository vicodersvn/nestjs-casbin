import { Injectable, Inject } from '@nestjs/common';
import { NOTIFICATION_OPTIONS } from './constants';
import { INotification } from './interfaces';
import { find } from 'lodash';

interface Entity {
  [key: string]: any;
}

@Injectable()
export class NotificationService {
  constructor(@Inject(NOTIFICATION_OPTIONS) private options: { [key: string]: any }) {}
  register(): any[] {
    return this.options.channels;
  }

  async send(entity: Entity, notification: INotification): Promise<any> {
    notification.notifiable = entity;
    const methods = notification.via();
    for (const method of methods) {
      const channel = find(this.options.channels, { name: method });
      if (channel) {
        await channel.execute(notification);
      }
    }
    return true;
  }
}
