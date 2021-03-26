import { Command, Error, Info, IOption } from './Command';
import * as fse from 'fs-extra';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

export class MakeCommandCommand extends Command {
  signature(): string {
    return 'make:command <command>';
  }

  description(): string {
    return 'Create new command';
  }

  options(): IOption[] {
    return [{ key: 'override?', description: 'Override existing file' }];
  }

  async handle(command: string, options: { override: undefined | string }): Promise<any> {
    if (_.isNil(command) || command === '') {
      Error('Command name is required');
    }
    const file = path.resolve(__dirname, '../../Console/Commands', `${command}.ts`);
    if (fs.existsSync(file) && (options.override === undefined || options.override.toString() !== 'true')) {
      Error(`${command} already exist`);
    }
    const content = `import { Command, IOption } from './Command';

export class ${command} extends Command {
  signature(): string {
    // The command signature is required
    // You may pass how many argument you want
    return 'command <first_argument> <second_argument>';
  }

  description(): string {
    // Description is optional
    return 'The description for your command here';
  }

  options(): IOption[] {
    // The array of your option, it's optional
    // There are two types of options: those that receive a value and those that don't.
    // If the option_name come with ? at the end, it mean this option don't want to receive any value, it will be boolean value
    // Now command support max 6 options
    // return [{ key: 'option_name?', description: 'The description for option here' }];
  }

  async handle(...args): Promise<any> {
    // Your code goes here
  }
}
    `;
    fse.outputFileSync(file, content);
    Info(`${file} is created`);

    return file;
  }
}
