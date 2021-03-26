import { Repository, getManager, SelectQueryBuilder, FindManyOptions, FindOneOptions } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isArray, omit, filter, keys, isUndefined } from 'lodash';
import { IPaginationOptions, Pagination } from './pagination';
import { default as slugify } from 'slugify';

const defaultPaginationOption: IPaginationOptions = {
  limit: 10,
  page: 1,
};

export class BaseService {
  public repository: Repository<any>;
  public entity: any;
  public alias = 'alias';

  async get(): Promise<any[]> {
    return this.repository.find();
  }

  private resolveOptions(options: IPaginationOptions): [number, number] {
    const page = options.page;
    const limit = options.limit;

    return [page, limit];
  }
  private async paginateQueryBuilder<T>(queryBuilder: SelectQueryBuilder<T>, options: IPaginationOptions): Promise<Pagination<T>> {
    const [page, limit] = this.resolveOptions(options);

    const [items, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return this.createPaginationObject<T>(items, total, page, limit);
  }

  private createPaginationObject<T>(items: T[], totalItems: number, currentPage: number, limit: number) {
    const totalPages = Math.ceil(totalItems / limit);

    return new Pagination(items, {
      totalItems: totalItems,
      itemCount: items.length,
      itemsPerPage: limit,

      totalPages: totalPages,
      currentPage: currentPage,
    });
  }

  async paginate(query_builder: Repository<any> | SelectQueryBuilder<any> | null, options: IPaginationOptions): Promise<Pagination<any>> {
    let query;
    if (!query_builder) {
      query = this.repository.createQueryBuilder(this.alias);
    } else {
      query = query_builder;
    }
    options = omit(
      options,
      filter(keys(options), function (key) {
        return isUndefined(options[key]);
      }),
    );
    options = { ...defaultPaginationOption, ...options };
    return this.paginateQueryBuilder(query, options);
  }

  async find(id: string | number, options?: { relations: string[] }): Promise<any> {
    return this.repository.findOne(id, options);
  }

  async findOrFail(id: string | number): Promise<any> {
    const item = await this.repository.findOne(id);
    if (item) {
      return item;
    } else {
      throw new BadRequestException('Resource not found');
    }
  }

  /**
   * Save a new model and return the instance.
   *
   * @param data
   */
  async create(data: { [key: string]: any }): Promise<any> {
    const manager = getManager();
    const item = await this.repository.create(data);
    await manager.save(this.entity, item);
    return item;
  }

  /**
   * Get the first record matching the attributes or create it
   *
   * @param options FindOneOptions
   * @param values
   */
  async firstOrCreate(options: FindOneOptions, values: { [key: string]: any }): Promise<any> {
    let item;
    const items = await this.repository.find({ ...options, ...{ take: 1 } });
    if (!isArray(items) || items.length === 0) {
      item = await this.create(values);
    } else {
      item = items[0];
    }
    return item;
  }

  /**
   * Execute the query and get the first result or throw an exception
   *
   * @param options FindOneOptions
   * @param values
   */
  async firstOrFail(options: FindOneOptions): Promise<any> {
    const items = await this.repository.find({ ...options, ...{ take: 1 } });
    if (!Array.isArray(items) || items.length === 0) {
      throw new NotFoundException('Resource');
    }
    return items[0];
  }

  /**
   * Update an entity in repository by id
   *
   * @param id number | string
   * @param data
   */
  async update(id: number | string, data: { [key: string]: any }): Promise<any> {
    const manager = getManager();
    const item = await this.repository.findOne(id);
    const result = await manager.save(this.entity, { ...item, ...data });
    return result;
  }

  /**
   * Create or update a related record matching the attributes, and fill it with values.
   *
   * @param values number | string
   * @param values
   *
   * @return entity
   */
  async updateOrCreate(attributes: { [key: string]: any }, values: { [key: string]: any }): Promise<any> {
    let item;
    const items = await this.repository.find({ where: attributes, take: 1 });
    if (!isArray(items) || items.length === 0) {
      item = await this.create(values);
    } else {
      item = await this.update(items[0].id, values);
    }
    return item;
  }

  /**
   * Get list of record
   *
   * @param condition FindManyOptions
   * @param columns string[]
   */

  async findWhere(condition: FindManyOptions, columns: string[] | null = null): Promise<any> {
    return this.repository.find({
      where: condition,
      select: columns,
    });
  }
  /**
   * Execute the query and get the first result
   *
   * @param options FindOneOptions
   */
  async first(options: FindOneOptions): Promise<any> {
    const items = await this.repository.find({
      ...options,
      ...{
        take: 1,
      },
    });
    if (Array.isArray(items) && items.length > 0) {
      return items[0];
    } else {
      return null;
    }
  }

  /**
   * Return number of record that match criteria
   *
   * @param options
   */
  async count(options: FindManyOptions): Promise<any> {
    return await this.repository.count(options);
  }

  /**
   * Destroy the models for the given ID
   *
   * @param id Number | String
   */
  async destroy(id: number | string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Generate slug
   *
   * @param name string
   * @return string
   */
  async generateSlug(name: string): Promise<string> {
    const makeid = (length: number): string => {
      let result = '';
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    };
    let i = 0;
    let slug = slugify(name, {
      replacement: '-',
      remove: undefined,
      lower: true,
    });
    let s = slug;
    while (true) {
      i++;
      if (i == 100) break;
      const count = await this.count({ where: { slug: s } });
      if (count === 0) {
        slug = s;
        break;
      } else {
        s = `${slug}-${makeid(8)}`;
      }
    }
    return slug;
  }
}
