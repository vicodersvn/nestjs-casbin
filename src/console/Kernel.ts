import { MakeCommandCommand } from './Commands/MakeCommandCommand';
import { KeyGenerateCommand } from './Commands/KeyGenerateCommand';
import { SeedCommand } from './Commands/SeedCommand';
import { MakeSeederCommand } from './Commands/MakeSeederCommand';

interface ICommand {
  'make:command': any;
  'make:seeder': any;
  'key:generate': any;
  seed: any;
}

export class Kernel {
  commands(): ICommand {
    return {
      'make:command': MakeCommandCommand,
      'make:seeder': MakeSeederCommand,
      'key:generate': KeyGenerateCommand,
      seed: SeedCommand,
    };
  }
}
