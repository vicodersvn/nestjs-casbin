/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Transformer } from '../../../shared/transformers/transformer';
import { PermissionGroupTransformer } from './permission-group.transformer';

interface PermissionInterface {
  id: number;
  name: string;
  slug: string;
  permission_group_id: number;
  permission_group?: any;
}

export class PermissionTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      permission_group_id: model.permision_group_id,
    };
  }
  includePermissionGroup(model: PermissionInterface): any {
    return this.item(model.permission_group, new PermissionGroupTransformer());
  }
}
