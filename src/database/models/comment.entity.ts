import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  comment_id!: number;

  @Column({ type: 'int', nullable: false })
  post_id!: number;

  @Column({ length: 45, nullable: false })
  user_id!: string;

  @Column({ length: 45, nullable: true })
  comment_content!: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  delete_flag!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @ManyToOne((type) => User)
  @JoinColumn({ referencedColumnName: 'user_id' })
  user!: User;

  @ManyToOne((type) => Post)
  @JoinColumn({ referencedColumnName: 'post_id' })
  post!: Post;
}
