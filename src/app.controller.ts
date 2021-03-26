import { Controller, Get, Inject } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { AppService } from './app.service';
import { CASBIN_ENFORCER } from './casbin/casbin.constants';
import { CasbinService } from './casbin/services/casbin.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer, private readonly casbinService: CasbinService) {}

  @Get()
  async getHello(): Promise<string> {
    const grant = await this.enforcer.enforce('alice', 'data1', 'read');
    return `Permission granted: <strong>${grant.toString()}</strong>`;
  }

  @Get('load')
  async loadPolicy(): Promise<string> {
    await this.enforcer.loadPolicy();
    return 'Casbin policy loaded';
  }
}
