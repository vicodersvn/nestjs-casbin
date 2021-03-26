export interface IOption {
  key: string;
  description: string;
}

interface ICommand {
  signature(): string;
  description(): string;
}
export class Command implements ICommand {
  signature(): string {
    return '';
  }

  description(): string {
    return '';
  }

  options(): IOption[] {
    return [];
  }
}

export const Info = (content: string): void => {
  console.log('\x1b[32m%s\x1b[0m', content);
};

export const Warning = (content: string): void => {
  console.log('\x1b[33m%s\x1b[0m', content);
};

export const Error = (content: string): void => {
  console.log('\x1b[31m%s\x1b[0m', content);
  process.exit(1);
};
