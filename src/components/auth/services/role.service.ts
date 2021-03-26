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
}
