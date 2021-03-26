import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ComponentsModule } from './components/components.module';
import validationSchema from '../config/validationSchema';
import configuration from '../config/configuration';
import { SharedModule } from './shared/shared.module';
import { CasbinModule } from './casbin/casbin.module';
import TypeORMAdapter from 'typeorm-adapter';
import { Adapter, Enforcer } from 'casbin';
import * as path from 'path';
import * as pick from 'lodash/pick';
@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    CasbinModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const adapter = await TypeORMAdapter.newAdapter({
          ...pick(config.get('database'), ['type', 'host', 'port', 'username', 'password', 'database']),
          ...{ dropSchema: false },
        });
        const enforcer = await new Enforcer();
        enforcer.initWithAdapter(path.resolve(process.cwd(), 'src/casbin/rbac_model.conf'), (adapter as any) as Adapter);
        await enforcer.loadPolicy();
        return enforcer;
      },
      inject: [ConfigService],
    }),
    ComponentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
