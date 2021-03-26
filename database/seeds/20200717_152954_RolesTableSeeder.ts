import { Connection } from 'typeorm';
import { Role } from '../../src/components/auth/entities/role.entity';

export default class RolesTableSeeder {
  async up(connection: Connection): Promise<any> {
    const items = [
      { name: 'Super Admin', slug: 'superadmin' },
      { name: 'Admin', slug: 'admin' },
      { name: 'User', slug: 'user' },
    ];
    const roles = items.map((i) => {
      const r = new Role();
      r.name = i.name;
      r.slug = i.slug;
      return r;
    });
    await connection.manager.save(roles);
  }
}
