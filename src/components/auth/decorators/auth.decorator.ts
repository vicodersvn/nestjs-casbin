/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard, RoleGuard));
}
