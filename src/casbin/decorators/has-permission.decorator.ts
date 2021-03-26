/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators, HttpException, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/components/auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';

export interface ICasbinRequest {
  subject: string;
  action: string;
}
export function HasPermission(subject: string, action: string) {
  if (!subject) {
    throw new HttpException('permission subject is required', 400);
  }
  if (!action) {
    throw new HttpException('permission action is required', 400);
  }
  const permission: ICasbinRequest = { subject, action };
  return applyDecorators(SetMetadata('permission', permission), UseGuards(JwtAuthGuard, PermissionGuard));
}
