#!/usr/bin/env node
import * as _ from 'lodash';
import * as program from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { Kernel } from './src/console/Kernel';

if (fs.existsSync(path.resolve(process.cwd(), '.env'))) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({
    path: path.resolve(process.cwd(), '.env'),
  });
}

const version = '1.1.0';

program.version(version, '-v, --version');
const kernel = new Kernel();
const commands = kernel.commands();
const command_key = process.argv[2];

if (
  typeof process.argv[2] === 'undefined' ||
  commands[command_key] === undefined
) {
  console.log('\x1b[31m%s\x1b[0m', 'No command to execute');
  process.exit(1);
}

if (_.isUndefined(process.argv[3])) {
  process.argv[3] = '';
}

const instance = new commands[command_key]();
if (
  _.isFunction(instance.options) &&
  _.isArray(instance.options()) &&
  instance.options().length > 0
) {
  const cmd = program
    .command(instance.signature())
    .description(instance.description());
  const options = instance.options();

  for (const option of options) {
    if (_.isUndefined(option.key)) {
      throw new Error('Option key is required');
    }
    if (_.isUndefined(option.description)) {
      throw new Error(`"${option.key}" option must have description`);
    }
    cmd.option(
      option.key.slice(-1) === '?'
        ? `--${option.key.slice(0, -1)}`
        : `--${option.key} <${option.key}>`,
      option.description,
    );
  }
  cmd.action(instance.handle);
} else {
  program
    .command(instance.signature())
    .description(instance.description())
    .action(instance.handle);
}

program.parse(process.argv);
