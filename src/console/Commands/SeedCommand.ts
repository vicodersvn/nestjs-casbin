import { Command, IOption } from './Command';
import { NestFactory } from '@nestjs/core';
import { Module, Injectable } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validationSchema from '../../../config/validationSchema';
import configuration from '../../../config/configuration';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import { Connection } from 'typeorm';
import { Info } from '../../console/Commands/Command';
import { SharedModule } from '../../shared/shared.module';

@Injectable()
export class SeedService {
  constructor(private connection: Connection) {}
  async handle(file: string): Promise<any> {
    if (fs.existsSync(file)) {
      const seeder = await import(file);
      const instance = new seeder.default();
      return await instance.up(this.connection);
    }
  }
  async run(seeder?: string): Promise<any> {
    const seederDirectoryPath = path.resolve(process.cwd(), 'database', 'seeds');
    if (_.isNil(seeder) || seeder === '') {
      const files = fs.readdirSync(seederDirectoryPath);
      for (const filename of files) {
        if (path.extname(filename) === '.ts') {
          const file = path.resolve(seederDirectoryPath, filename);
          Info(`[${new Date()}] Processing ${filename}`);
          await this.handle(file);
          Info(`[${new Date()}] Completed ${filename}`);
        }
      }
    } else {
      if (path.extname(seeder) === '.ts') {
        const file = path.resolve(seederDirectoryPath, seeder);
        Info(`[${new Date()}] Processing ${seeder}`);
        await this.handle(file);
        Info(`[${new Date()}] Completed ${seeder}`);
      }
    }
  }
}

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
  ],
  providers: [SeedService],
})
class SeederModule {}
export class SeedCommand extends Command {
  constructor() {
    super();
  }
  signature(): string {
    return 'seed';
  }

  description(): string {
    // Description is optional
    return 'The description for your command here';
  }

  options(): IOption[] {
    return [
      { key: 'override?', description: 'Clean data before seed new data' },
      { key: 'file', description: 'Special file to seed' },
    ];
  }

  async handle(options: { override: boolean; file: string }): Promise<any> {
    const app = await NestFactory.create(SeederModule);
    const seedService = app.get(SeedService);
    if (!_.isNil(options.file) && options.file !== '') {
      await seedService.run(options.file);
    } else {
      await seedService.run();
    }
    app.close();
  }
}
