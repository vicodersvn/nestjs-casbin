import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CasbinService } from './services/casbin.service';
import { ConnectionOptions } from 'typeorm';
import { CASBIN_ENFORCER } from './casbin.constants';
import { Adapter, Enforcer } from 'casbin';
import TypeORMAdapter from 'typeorm-adapter';
import { CasbinAsyncOptions } from './casbin.option.interface';

@Module({})
export class CasbinModule {
  public static forRootAsync(options: CasbinAsyncOptions): DynamicModule {
    return {
      module: CasbinModule,
      imports: options.imports || [],
      providers: [this.createConnectOptionsProvider(options), CasbinService],
      exports: [this.createConnectOptionsProvider(options), CasbinService],
    };
  }

  private static createConnectOptionsProvider(options: CasbinAsyncOptions): Provider {
    return {
      provide: CASBIN_ENFORCER,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
