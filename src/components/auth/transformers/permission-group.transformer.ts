/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Transformer } from '../../../shared/transformers/transformer';

export class PermissionGroupTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
    };
  }
}
