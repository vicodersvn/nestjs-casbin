import { Controller, Get, Query, Post, Req, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { ApiResponseService } from 'src/shared/services/api-response/api-response.service';
import { RoleService } from '../../services/role.service';
import { IPaginationOptions } from '../../../../shared/services/pagination';
import { Auth } from '../../decorators/auth.decorator';
import { RoleTransformer } from '../../transformers/role.transformer';
import { Request } from 'express';
import { assign } from 'lodash';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('api/v1/roles')
export class RoleController {
  constructor(private response: ApiResponseService, private roleService: RoleService) {}
  @Get()
  @Auth('admin')
  async index(@Query() query: { per_page: number; page: number; search: string }): Promise<any> {
    const params: IPaginationOptions = {
      limit: query.per_page,
      page: query.page,
    };
    let query_buildler = this.roleService.repository.createQueryBuilder('role');
    if (query.search && query.search !== '') {
      query_buildler = query_buildler.where('role.name LIKE :keyword', {
        keyword: `%${query.search}%`,
      });
    }
    const data = await this.roleService.paginate(query_buildler, params);
    return this.response.paginate(data, new RoleTransformer([]));
  }

  @Post('')
  @Auth('admin')
  async saveObjective(@Req() request: Request): Promise<any> {
    const data = (request as any).body;
    const slug = await this.roleService.generateSlug(data.name);
    const role = await this.roleService.create(assign(data, { slug: slug }));
    return this.response.item(role, new RoleTransformer());
  }

  @Get(':id')
  @Auth('admin')
  async show(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const role = await this.roleService.find(id, {
      relations: ['permissions'],
    });
    return this.response.item(role, new RoleTransformer(['permissions']));
  }

  @Put(':id')
  @Auth('admin')
  async update(@Param('id', ParseIntPipe) id: number, @Req() request: Request): Promise<any> {
    const data = (request as any).body;
    const slug = await this.roleService.generateSlug(data.name);
    const role = await this.roleService.update(id, assign(data, { slug: slug }));
    return this.response.item(role, new RoleTransformer());
  }

  @Delete(':id')
  @Auth('admin')
  async delete(@Param('id', ParseIntPipe) id: string): Promise<any> {
    await this.roleService.destroy(id);
    return { data: 'success' };
  }
}
