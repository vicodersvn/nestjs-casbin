import database from './database';

export = {
  ...database(),
  ...{ migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'] },
};
