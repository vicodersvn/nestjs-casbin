import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../../auth/entities/role.entity';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';

@Notifiable()
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', default: '' })
  first_name: string;

  @Column({ type: 'varchar', default: '' })
  last_name: string;

  @Column({
    type: 'int',
    default: 1,
  })
  status: number;

  @Column({
    type: 'varchar',
    default: '',
  })
  verify_token: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  verified: boolean;

  @Column({ type: 'timestamp' })
  public verified_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deleted_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public updated_at: Date;

  @ManyToMany(() => Role, (role) => role.users, { cascade: ['insert'] })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  getEmail(): string {
    return this.email;
  }

  generateVerifyEmailLink(base_url: string): string {
    const path = `/auth/verify?token=${this.verify_token}`;
    const url = new URL(path, base_url);
    return url.href;
  }
}
