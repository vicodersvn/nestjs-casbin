import { MAIL } from './channels/email/constants';
import { INotifiable } from './interfaces';

export interface INotification {
  via(): string[];
}

export class Notification implements INotification {
  public notifiable: any;

  via(): string[] {
    return [];
  }

  setNotifiable(notifiable: INotifiable): void {
    this.notifiable = notifiable;
  }

  async execute(): Promise<any> {
    const channels = this.via();
    for (const channel of channels) {
      if (channel === MAIL) {
      }
    }
  }
}
