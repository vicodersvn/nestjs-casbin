import { Command, IOption, Warning } from './Command';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as dotenv from 'dotenv';
import { File } from '../File';
import * as crypto from 'crypto';

export class KeyGenerateCommand extends Command {
  private file: File;
  constructor() {
    super();
    this.file = new File();
  }
  signature(): string {
    return 'key:generate';
  }

  description(): string {
    return 'Generate new application key';
  }

  options(): IOption[] {
    return [{ key: 'override?', description: 'Override existing APP_KEY' }];
  }

  async handle(): Promise<any> {
    const variable = 'APP_KEY';
    const value = crypto.createHash('md5').update(new Date().toISOString()).digest('hex');
    const val = fs.readFileSync(path.resolve(process.cwd(), '.env'));
    console.log(path.resolve(process.cwd(), '.env'));
    if (val) {
      const is_declared = val.indexOf(variable) > -1;
      if (!is_declared) {
        await this.file.appendTo(path.resolve(process.cwd(), '.env'), `${variable}="${value}"\n`);
      } else {
        const buf = Buffer.from(val);
        const value = dotenv.parse(buf);
        if (_.isNil(value.variable) || value.variable === '') {
          Warning('Environment variable is declared but it is empty');
        } else {
          console.log('Environment variable is declared !');
        }
      }
    }
  }
}
