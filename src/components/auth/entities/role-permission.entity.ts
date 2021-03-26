import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role_permission' })
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  role_id: number;

  @Column()
  permission_id: number;
}
