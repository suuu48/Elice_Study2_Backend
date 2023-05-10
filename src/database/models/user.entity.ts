import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Review } from './review.entity';

export type UserProfile = {
  user_id: string;
  user_name: string;
  user_nickname: string;
  location_user: string;
  user_img: string;
};

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

  @Column({ type: 'varchar', nullable: true, default: null })
  user_img!: string;

  @OneToMany((type) => Review, (review) => review.user)
  reviews!: Review[]; // 작성한 리뷰
}
