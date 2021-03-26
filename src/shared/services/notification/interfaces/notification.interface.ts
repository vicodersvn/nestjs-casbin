export interface INotification {
  notifiable: any;
  via(): string[];
}
