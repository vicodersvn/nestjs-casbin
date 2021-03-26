import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { userProviders } from '../user/user.providers';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ForgotPasswordController } from './controllers/forgot-password/forgot-password.controller';
import { PasswordResetService } from './services/password-reset.service';
import { PermissionController } from './controllers/permission/permission.controller';
import { PermissionService } from './services/permission.service';
import { RoleController } from './controllers/role/role.controller';
import { RoleService } from './services/role.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('APP_KEY'),
        signOptions: {
          expiresIn: configService.get('JWT_TTL'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [...userProviders, JwtStrategy, PasswordResetService, PermissionService, RoleService],
  controllers: [AuthController, ForgotPasswordController, PermissionController, RoleController],
})
export class AuthModule {}
