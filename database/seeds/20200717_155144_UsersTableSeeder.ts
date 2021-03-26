import { Connection } from 'typeorm';
import { User } from '../../src/components/user/entities/user.entity';
import { HashService } from '../../src/shared/services/hash/hash.service';
import { Role } from '../../src/components/auth/entities/role.entity';
import * as _ from 'lodash';

export default class UsersTableSeeder {
  public hashService: HashService;
  constructor() {
    this.hashService = new HashService();
  }
  async up(connection: Connection): Promise<any> {
    const roleRepository = connection.getRepository(Role);
    const roles = await roleRepository.find();
    const items = [
      { email: 'superadmin@vicoders.com', username: 'superadmin', password: this.hashService.hash('secret'), role: 'superadmin' },
      { email: 'admin@vicoders.com', username: 'admin', password: this.hashService.hash('secret'), role: 'admin' },
      { email: 'user@vicoders.com', username: 'user', password: this.hashService.hash('secret'), role: 'user' },
    ];
    const users = items.map((i) => {
      const user = new User();
      user.email = i.email;
      user.username = i.username;
      user.password = i.password;
      user.roles = _.filter(roles, { slug: i.role });
      return user;
    });
    await connection.manager.save(users);
  }
}
