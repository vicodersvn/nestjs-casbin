import { MAIL } from '../../../shared/services/notification/channels/email/constants';
import { Notification } from '../../../shared/services/notification/notification';
import { IMailable, Mailable } from '../../../shared/services/notification/channels/email/mailable';

export class SendConfirmedCandidateNotification extends Notification {
  public mess;
  constructor(mess: string) {
    super();
    this.mess = mess;
  }

  via(): string[] {
    return [MAIL];
  }

  toMail(): IMailable | Promise<IMailable> {
    return new Mailable().to(this.notifiable.email).subject('Kết quả phỏng vấn').greeting('Hi!').line(this.mess).line('Thank you for your patience.');
  }
}
