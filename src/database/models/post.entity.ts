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
import { Comment, foundCommentsOutput } from './comment.entity';

interface PostProfile {
  post_id: number;
  user_id: string;
  post_category: string;
  post_title: string;
  post_content: string;
  post_img: string | null;
  created_at: Timestamp;
  comments: foundCommentsOutput[];
}

export type createPostInput = Omit<PostProfile, 'post_id' | 'created_at' | 'comments'>;

export type updatePostInput = Partial<
  Omit<PostProfile, 'user_id' | 'post_id' | 'created_at' | 'comments'>
>;

export type foundAllPostOutput = Omit<PostProfile, 'comments'>;

export type foundCategoriesOutput = { categories: string[] };

export type foundPostsOutput = Omit<PostProfile, 'post_category' | 'post_content' | 'comments'> & {
  user_nickname: string;
  comment_count: number;
};

export type foundPostOutput = Omit<PostProfile, 'user_id'> & {
  user_img: string | null;
  user_nickname: string;
  comment_count: number;
};

export type createdPostOutput = Omit<PostProfile, 'user_id' | 'comments'> & {
  user_img: string | null;
  user_nickname: string;
  comment_count: number;
};

export type updatedPostOutput = createdPostOutput;

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

  @Column({ length: 250, nullable: true, default: null })
  post_img!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Timestamp;

  @ManyToOne((type) => User)
  @JoinColumn({ referencedColumnName: 'user_id' })
  user!: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments!: Comment[];
}
