import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
interface PostProfile {
  user_id: string;
  post_category: string;
  post_title: string;
  post_content: string;
  post_img: string;
}

export type createPostInput = PostProfile;

export type updatePostInput = Partial<Omit<PostProfile, 'user_id'>>;

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id!: number;

  @Column({ length: 45, nullable: false })
  user_id!: string;

  @Column({ length: 45, nullable: false })
  post_category!: string;

  @Column({ length: 45, nullable: true })
  post_title!: string;

  @Column({ length: 45, nullable: true })
  post_content!: string;

  @Column({ length: 45, nullable: true })
  post_img!: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  delete_flag!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @ManyToOne((type) => User)
  @JoinColumn({ referencedColumnName: 'user_id' })
  user!: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments!: Comment[]; // 댓글
}
