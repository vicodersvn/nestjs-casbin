import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_role' })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  user_id: number;

  @Column()
  role_id: number;
}
