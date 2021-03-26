import { UserService } from '../../user/services/user.service';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { JwtService } from '@nestjs/jwt';
import { pick } from 'lodash';
import { Controller, Post, Body, ConflictException, UnauthorizedException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiHeader, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginParams, RegisterParams } from '../auth.dto';

const autheticatedUserFields = ['id', 'email'];
@ApiTags('Auth')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/v1/auth')
export class AuthController {
  constructor(private userService: UserService, private response: ApiResponseService, private jwtService: JwtService) {}

  @Post('/register')
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiConflictResponse({ description: 'Email already exist' })
  async register(@Body() data: RegisterParams): Promise<{ [key: string]: any }> {
    const { email, password } = data;
    if (await this.userService.isExisting(email)) {
      throw new ConflictException('Email already exist');
    }
    const user = await this.userService.create({
      ...pick(data, ['email', 'password', 'first_name', 'last_name']),
      ...{
        password: this.userService.hashPassword(password),
        email: this.userService.sanitizeEmail(email),
      },
    });
    return this.response.primitive({
      token: this.jwtService.sign(pick(user, autheticatedUserFields)),
    });
  }

  @Post('/login')
  @ApiResponse({ status: 201, description: 'Authenticated' })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async login(@Body() data: LoginParams): Promise<{ [key: string]: any }> {
    const { email, password } = data;
    const user = await this.userService.first({
      where: {
        email: this.userService.sanitizeEmail(email),
      },
      select: [...autheticatedUserFields, 'password'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = this.userService.checkPassword(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Password does not match');
    }
    return this.response.primitive({
      token: this.jwtService.sign(pick(user, autheticatedUserFields)),
    });
  }
}
