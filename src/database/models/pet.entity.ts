import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export type createPetInput = {
  pet_name: string;
  pet_gender: string;
  pet_species: string;
  pet_birth: Date;
  pet_info: string;
  pet_img: string | null;
  user_id: string;
};
export type updatePetInput = Partial<createPetInput>;
// export type updatePetInput = Partial<Omit<createPetInput, 'user_id'>>;
@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  pet_id!: number;

  @Column({ type: 'varchar' })
  pet_name!: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  pet_gender!: string;

  @Column({ type: 'varchar' })
  pet_species!: string;

  @Column({ type: 'datetime' })
  pet_birth!: Date;

  @Column({ type: 'varchar' })
  pet_info!: string;

  @Column({ type: 'varchar' })
  pet_img!: string | null;

  @Column({ type: 'varchar' })
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: 'user_id' })
  user!: User;
}
