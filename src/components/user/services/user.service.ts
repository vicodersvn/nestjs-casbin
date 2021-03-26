import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { BaseService } from '../../../shared/services/base.service';
import { UserRepository } from '../repositories/user.repository';
import { Repository, Connection } from 'typeorm';
import { HashService } from '../../../shared/services/hash/hash.service';
import { Role } from '../../auth/entities/role.entity';
import { UserRole } from '../../auth/entities/user-role.entity';

@Injectable()
export class UserService extends BaseService {
  public repository: Repository<any>;
  public entity: any = User;

  constructor(private connection: Connection, private hashService: HashService) {
    super();
    this.repository = connection.getCustomRepository(UserRepository);
  }

  async isExisting(email: string): Promise<boolean> {
    const is_existing = (await this.repository.count({ where: { email } })) > 0;
    return is_existing;
  }

  async generateVerifyToken(id: number): Promise<boolean> {
    const item = await this.update(id, {
      verify_token: `${this.hashService.md5(id.toString())}${this.hashService.md5(new Date().toISOString())}`,
    });
    return item;
  }

  async verify(id: number): Promise<User> {
    const item = await this.update(id, {
      verify_token: '',
      verified: true,
      verified_at: new Date(),
    });
    return item;
  }

  sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  hashPassword(password: string): string {
    return this.hashService.hash(password);
  }

  checkPassword(password: string, hashed: string): boolean {
    return this.hashService.check(password, hashed);
  }

  /**
   * Change password of given user_id
   *
   * @param id  number | string
   * @param password string
   */
  async changePassword(id: number | string, password: string): Promise<User> {
    return await this.update(id, { password: this.hashService.hash(password) });
  }

  async attachRole(userId: number | string, roleId: number | string): Promise<any> {
    const role = await this.connection.getRepository(Role).findOne(roleId);
    const user = await this.connection.getRepository(User).findOne(userId);

    if (role && user) {
      const check = await this.connection
        .getRepository(UserRole)
        .createQueryBuilder('user_role')
        .where('user_role.user_id = :user_id', { user_id: user.id })
        .andWhere('user_role.role_id = :role_id', { role_id: role.id })
        .getOne();
      if (!check) {
        await this.connection
          .getRepository(UserRole)
          .createQueryBuilder()
          .insert()
          .into(UserRole)
          .values({
            user_id: user.id,
            role_id: role.id,
          })
          .execute();
      }
    }
    return null;
  }

  async dettachRole(userId: number | string, roleId: number | string): Promise<any> {
    const role = await this.connection.getRepository(Role).findOne(roleId);
    const user = await this.connection.getRepository(User).findOne(userId);

    if (role && user) {
      const check = await this.connection
        .getRepository(UserRole)
        .createQueryBuilder('user_role')
        .where('user_role.user_id = :user_id', { user_id: user.id })
        .andWhere('user_role.role_id = :role_id', { role_id: role.id })
        .getOne();
      if (check) {
        await this.connection
          .getRepository(UserRole)
          .createQueryBuilder('user_role')
          .delete()
          .where('user_role.user_id = :user_id', { user_id: user.id })
          .andWhere('user_role.role_id = :role_id', { role_id: role.id })
          .execute();
      }
    }
    return null;
  }
}
