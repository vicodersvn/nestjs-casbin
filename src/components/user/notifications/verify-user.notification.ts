import { MAIL } from '../../../shared/services/notification/channels/email/constants';
import { Mailable, IMailable } from '../../../shared/services/notification/channels/email/mailable';
import { Notification } from '../../../shared/services/notification/notification';

export class VerifyUserNotification extends Notification {
  public url: string;
  constructor(url: string) {
    super();
    this.url = url;
  }
  via(): string[] {
    return [MAIL];
  }

  toMail(): IMailable | Promise<IMailable> {
    return new Mailable()
      .to(this.notifiable.email)
      .greeting('Hello')
      .subject('Verify your Pigeon ID email address')
      .line('You have selected this email address as your new Pigeon ID. To verify this email address belongs to you click to the button bellow and follow instruction')
      .action('Verify', this.url)
      .line('If you did not make this request, you can ignore this email. No Pigeon ID will be created without verification.');
  }
}
