import database from './database';

export default (): any => ({
  database: database(),
});
