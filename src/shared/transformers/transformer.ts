import { InternalServerErrorException } from '@nestjs/common';
import { isNil, isArray, forEach, camelCase, isFunction, map } from 'lodash';

interface Entity {
  [key: string]: any;
}

export interface TransformerInterface {
  get(entity: Entity): Entity;
  /**
   * Create a new item resource object
   *
   * @param entity mixed
   * @param transformer Transformer
   *
   * @return Entity
   */
  item(entity: Entity, transformer: TransformerInterface): { data: Entity };

  /**
   * Create a new collection resource object
   *
   * @param collection
   * @param transformer
   *
   * @return Collection
   */
  collection(collection: Entity[], transformer: TransformerInterface): { data: Entity };

  /**
   * Create a new primitive resource object
   *
   * @param collection
   * @param transformer
   *
   * @return object
   */
  primitive(data: { [key: string]: any }): { data: { [key: string]: any } };
}

export class Transformer implements TransformerInterface {
  public includes: any[];
  constructor(includes?: any[]) {
    this.includes = includes;
  }

  item(entity: Entity, transformer: TransformerInterface): { data: Entity } {
    if (isNil(entity)) {
      return null;
    }
    return { data: transformer.get(entity) };
  }

  collection(collection: Entity[], transformer: TransformerInterface): { data: Entity } {
    if (!isArray(collection)) {
      throw new InternalServerErrorException('collection should be an array');
    }
    const data = map(collection, (i) => transformer.get(i));
    return { data };
  }

  primitive(data: { [key: string]: any }): { data: { [key: string]: any } } {
    return { data };
  }

  get(entity: Entity): Entity {
    const data = (this as any).transform(entity);
    if (Array.isArray(this.includes) && this.includes.length > 0) {
      forEach(this.includes, (include) => {
        const f = camelCase(`include_${include}`);
        if (!isFunction(this[f])) {
          throw new Error(`${f} function is missing`);
        }
        data[include] = this[f](entity);
      });
    }
    return data;
  }

  with(include: string): TransformerInterface {
    this.includes.push(include);
    return this;
  }
}
