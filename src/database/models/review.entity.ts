import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export type createReviewInput = {
  location_id: string;
  user_id: string;
  review_content: string;
  star_rating: number;
  review_img: string | null;
};
export type updateReviewInput = Partial<Omit<createReviewInput, 'user_id'>>;

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  review_id!: number;

  @Column({ type: 'varchar' })
  location_id!: string;

  @Column({ type: 'varchar' })
  user_id!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  review_content!: string;

  @Column({ type: 'int', nullable: true, default: null })
  star_rating!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'varchar', length: 100, default: null })
  review_img!: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: 'user_id' })
  user!: User;
}
