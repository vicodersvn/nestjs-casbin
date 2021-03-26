import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../shared/services/base.service';
import { Repository, Connection } from 'typeorm';
import { PasswordReset } from '../entities/password-reset.entity';
import { PasswordResetRepository } from '../repositories/password-reset.repository';
import { HashService } from '../../../shared/services/hash/hash.service';

@Injectable()
export class PasswordResetService extends BaseService {
  public repository: Repository<any>;
  public entity: any = PasswordReset;

  constructor(private connection: Connection, private hashService: HashService) {
    super();
    this.repository = connection.getCustomRepository(PasswordResetRepository);
  }

  /**
   * Expire given token
   *
   * @param email string
   */
  async expire(token: string): Promise<any> {
    await this.repository
      .createQueryBuilder('password_reset')
      .update(this.entity)
      .set({ expire: () => 'NOW()' })
      .where('token = :token', { token })
      .execute();
  }

  /**
   * Expire all token of an email
   *
   * @param email string
   */
  async expireAllToken(email: string): Promise<any> {
    await this.repository
      .createQueryBuilder('password_reset')
      .update(this.entity)
      .set({ expire: () => 'NOW()' })
      .where('email = :email', { email })
      .andWhere('expire >= NOW()')
      .execute();
  }

  /**
   * Create new password reset token
   *
   * @param email string
   */
  async generate(email: string): Promise<any> {
    return await this.create({
      email: email,
      token: this.hashService.md5(new Date().toISOString()),
    });
  }

  /**
   * Dertemine
   *
   * @param entity
   */
  isExpired(entity: PasswordReset): boolean {
    const current_time = new Date();
    return current_time > new Date(entity.expire);
  }
}
