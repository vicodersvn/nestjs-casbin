import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CasbinService } from './services/casbin.service';
import { ConnectionOptions } from 'typeorm';
import { CASBIN_ENFORCER } from './casbin.constants';
import { Adapter, Enforcer } from 'casbin';
import TypeORMAdapter from 'typeorm-adapter';

@Module({})
export class CasbinModule {
  public static forRootAsync(dbConnectionOptions: ConnectionOptions, casbinModelPath: string): DynamicModule {
    const casbinEnforcerProvider: Provider = {
      provide: CASBIN_ENFORCER,
      useFactory: async () => {
        const adapter = await TypeORMAdapter.newAdapter(dbConnectionOptions);
        const enforcer = await new Enforcer();
        enforcer.initWithAdapter(casbinModelPath, (adapter as any) as Adapter);
        await enforcer.loadPolicy();
        return enforcer;
      },
    };
    return {
      exports: [casbinEnforcerProvider, CasbinService],
      module: CasbinModule,
      providers: [casbinEnforcerProvider, CasbinService],
    };
  }
}
