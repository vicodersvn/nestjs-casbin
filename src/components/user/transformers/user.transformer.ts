import { Transformer } from '../../../shared/transformers/transformer';
import { RoleTransformer } from '../../auth/transformers/role.transformer';
import { User } from '../entities/user.entity';

export class UserTransformer extends Transformer {
  transform(model: User): any {
    return {
      id: model.id,
      email: model.email,
      username: model.username,
      first_name: model.first_name,
      last_name: model.last_name,
      status: model.status,
      verified: model.verified,
      verified_at: model.verified_at,
      deleted_at: model.deleted_at,
      created_at: model.created_at,
      updated_at: model.updated_at,
    };
  }

  includeRoles(model: User): any {
    return this.collection(model.roles, new RoleTransformer());
  }
}
