import { MAIL } from '../../../shared/services/notification/channels/email/constants';
import { Mailable, IMailable } from '../../../shared/services/notification/channels/email/mailable';
import { Notification } from '../../../shared/services/notification/notification';

export class UserSendMailReportNotification extends Notification {
  public mailSend: string;
  public linkReport: string;
  constructor(mailSend: string, linkReport: string) {
    super();
    this.mailSend = mailSend;
    this.linkReport = linkReport;
  }
  via(): string[] {
    return [MAIL];
  }

  toMail(): IMailable | Promise<IMailable> {
    return new Mailable().to(this.mailSend).from(this.notifiable.email, 'Vicoders').greeting('Hello').subject('Work report !').action('Report', this.linkReport);
  }
}
