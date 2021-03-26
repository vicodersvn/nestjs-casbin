/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Transformer } from '../../../shared/transformers/transformer';
import { PermissionTransformer } from './permission.transformer';

interface RoleInterface {
  id: number;
  name: string;
  slug: string;
  permissions?: any;
}

export class RoleTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      level: model.level,
    };
  }
  includePermissions(model: RoleInterface): any {
    return this.collection(model.permissions, new PermissionTransformer());
  }
}
