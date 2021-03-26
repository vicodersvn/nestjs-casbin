import { User } from '../src/components/user/entities/user.entity';
import { Role } from '../src/components/auth/entities/role.entity';
import { Permission } from '../src/components/auth/entities/permission.entity';
import { PasswordReset } from '../src/components/auth/entities/password-reset.entity';
import { RolePermission } from '../src/components/auth/entities/role-permission.entity';
import { UserRole } from '../src/components/auth/entities/user-role.entity';

export default (): any => ({
  type: process.env.DB_CONNECTION || 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  entities: [User, Role, Permission, PasswordReset, RolePermission, UserRole],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: process.env.DB_LOGGING === 'true',
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'database/migrations',
  },
});
