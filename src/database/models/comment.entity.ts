import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Timestamp, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

interface CommentProfile {
  comment_id: number;
  post_id: number;
  user_id: string;
  comment_content: string;
  created_at: Timestamp;
}

export type createCommentInput = Omit<CommentProfile, 'comment_id' | 'created_at'>;

export type updateCommentInput = Partial<Pick<CommentProfile, 'comment_content'>>;

export type getCommentsOutput = Omit<CommentProfile, 'post_id' | 'user_id'> & {
  user_img: string | null;
  user_nickname: string;
  comment_content: string;
  created_at: Timestamp;
};

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  comment_id!: number;

  @Column({ type: 'int', nullable: false })
  post_id!: number;

  @Column({ length: 45, nullable: false })
  user_id!: string;

  @Column({ length: 100, nullable: false })
  comment_content!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Timestamp;

  @ManyToOne((type) => User)
  @JoinColumn({ referencedColumnName: 'user_id' })
  user!: User;

  @ManyToOne((type) => Post)
  @JoinColumn({ referencedColumnName: 'post_id' })
  post!: Post;
}
