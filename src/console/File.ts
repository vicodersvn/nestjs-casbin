import { ShellString, sed } from 'shelljs';

export class File {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  appendTo(file: string, content: string) {
    return ShellString(content).toEnd(file);
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  sed(file: string, regex: string, content: string) {
    return sed('-i', regex, content, file);
  }
}
