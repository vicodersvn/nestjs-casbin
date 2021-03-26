import { SetMetadata } from '@nestjs/common';

export const Notifiable = (...abilities: any[]): any => SetMetadata('abilities', abilities);
