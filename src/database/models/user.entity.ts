import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Review } from './review.entity';
import { Pet } from './pet.entity';

export type UserProfile = {
  user_id: string;
  user_name: string;
  user_nickname: string;
  user_location: string;
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

  @Column({ type: 'varchar', default: 'user'  })
  verify!: string;

  @Column({ type: 'varchar' })
  user_location!: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  delete_flag!: boolean;

  @Column({ type: 'varchar', nullable: true, default: null })
  user_img!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  deleted_at!: Date;

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[]; // 작성한 리뷰

  @OneToMany(() => Pet, (pet) => pet.user)
  pets!: Pet[]; // 작성한 리뷰
}
