import { EntityRepository, Repository } from 'typeorm';
import { PasswordReset } from '../entities/password-reset.entity';

@EntityRepository(PasswordReset)
export class PasswordResetRepository extends Repository<PasswordReset> {}
