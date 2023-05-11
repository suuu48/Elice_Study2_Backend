import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  review_id!: number;

  @Column({ type: 'varchar' })
  location_id!: string;

  @Column({ type: 'varchar' })
  location_name!: string;

  @Column({ type: 'varchar' })
  location_category!: string;

  @Column({ type: 'varchar' })
  user_id!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  review_content!: string;

  @Column({ type: 'double', nullable: true, default: null })
  star_rating!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @ManyToOne((type) => User)
  @JoinColumn({ referencedColumnName: 'user_id' })
  user!: User;
}
