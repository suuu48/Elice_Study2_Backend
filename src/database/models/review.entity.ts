import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
export type ReviewProfile = {
  review_id: string;
  location_id: string;
  location_name: string;
  location_category: string;
  user_id: string;
  review_content: string;
  delete_flag: boolean;
  created_at: Date;
};

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  review_id!: number;

  @Column({ type: 'varchar' })
  location_id!: string;

  @Column({ type: 'varchar' })
  location_name!: string;

  @Column({ type: 'varchar' })
  user_id!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  review_content!: string;

  @Column({ type: 'double', nullable: true, default: null })
  star_rating!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: 'user_id' })
  user!: User;
}
