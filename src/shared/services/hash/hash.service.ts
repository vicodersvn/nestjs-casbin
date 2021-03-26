import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class HashService {
  public saltRounds = 10;

  hash(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(this.saltRounds), null);
  }

  check(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  md5(data: any): string {
    return crypto.createHash('md5').update(data).digest('hex');
  }
}
