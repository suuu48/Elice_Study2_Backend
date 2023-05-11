import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export type PetProfile = {
  pet_id: number;
  pet_name: string;
  user_id: string;
  delete_flag: boolean;
};

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  pet_id!: number;

  @Column({ type: 'varchar' })
  pet_name!: string;

  @Column({ type: 'varchar' })
  user_id!: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  delete_flag!: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: 'user_id' })
  user!: User;
}
