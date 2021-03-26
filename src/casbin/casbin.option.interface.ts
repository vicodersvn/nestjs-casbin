/* Dependencies */
import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface CasbinAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<any>;
  providers?: any[];
  exports?: any[];
}
