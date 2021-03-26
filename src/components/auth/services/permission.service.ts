import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../shared/services/base.service';
import { Repository, Connection } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Permission;

  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getRepository(this.entity);
  }
}
