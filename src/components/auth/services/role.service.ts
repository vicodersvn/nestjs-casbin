import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../shared/services/base.service';
import { Repository, Connection } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { isEmpty } from 'lodash';

@Injectable()
export class RoleService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Role;

  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getRepository(this.entity);
  }
  async savePermissionsToRole(id: number | string, permission_ids: []): Promise<any> {
    let permissions = [];
    if (!isEmpty(permission_ids)) {
      permissions = await this.connection
        .getRepository(Permission)
        .createQueryBuilder('permission')
        .where('permission.id IN (:...permission_ids)', {
          permission_ids: permission_ids,
        })
        .getMany();
    }
    const role = await this.connection.getRepository(Role).createQueryBuilder('role').where('role.id = :id', { id: id }).getOne();
    role.permissions = permissions;
    return await this.connection.manager.save(role);
  }
}
