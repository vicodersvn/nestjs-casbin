import { SetMetadata } from '@nestjs/common';

export const Roles: any = (...roles: string[]) => SetMetadata('roles', roles);
