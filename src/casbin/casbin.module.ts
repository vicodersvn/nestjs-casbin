import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { CasbinService } from './services/casbin.service';
import { CASBIN_ENFORCER } from './casbin.constants';
import { CasbinAsyncOptions } from './casbin.option.interface';

@Global()
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
