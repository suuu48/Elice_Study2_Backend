import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id!: string;

  @Column({ type: 'varchar' })
  user_name!: string;

  @Column({ type: 'varchar' })
  user_password!: string;

  @Column({ type: 'varchar' })
  user_nickname!: string;

  @Column({ type: 'varchar' })
  verify!: string;

  @Column({ type: 'varchar' })
  location_user!: string;

  @Column({ default: 0 })
  delete_flag!: boolean;

  @Column({ type: 'varchar' , nullable: true, default: null })
  user_img!: string;
}
