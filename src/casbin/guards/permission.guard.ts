import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isArray } from 'lodash';
import { ICasbinRequest } from '../decorators/has-permission.decorator';
import { CASBIN_ENFORCER } from '../casbin.constants';
import { Enforcer } from 'casbin';
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector, @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer) {}

  canActivate(context: ExecutionContext): boolean {
    const permission: ICasbinRequest = this.reflector.get<ICasbinRequest>('permission', context.getHandler());
    if (!permission) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const roles = request?.user?.roles;
    if (!isArray(roles) || roles.length === 0) {
      return false;
    }
    return roles.some((role) => this.enforcer.enforceSync(role.slug, permission.subject, permission.action));
  }
}
