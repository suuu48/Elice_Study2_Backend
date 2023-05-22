import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Timestamp,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

interface PostProfile {
  post_id: number;
  user_id: string;
  post_category: string;
  post_title: string;
  post_content: string;
  post_img?: string;
  created_at: Timestamp;
  comments: Comment[];
}

export type createPostInput = Omit<PostProfile, 'post_id' | 'created_at' | 'comments'>;

export type updatePostInput = Partial<
  Omit<PostProfile, 'user_id' | 'post_id' | 'created_at' | 'comments'>
>;

export type getPostsOutput = Omit<PostProfile, 'post_category' | 'post_content' | 'comments'> & {
  user_nickname: string;
  comment_count: number;
};

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id!: number;

  @Column({ length: 45, nullable: false })
  user_id!: string;

  @Column({ length: 45, nullable: false })
  post_category!: string;

  @Column({ length: 60, nullable: false })
  post_title!: string;

  @Column({ length: 250, nullable: false })
  post_content!: string;

  @Column({ length: 100, nullable: true, default: null })
  post_img!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Timestamp;

  @ManyToOne((type) => User)
  @JoinColumn({ referencedColumnName: 'user_id' })
  user!: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments!: Comment[];
}
