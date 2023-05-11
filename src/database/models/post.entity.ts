import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id!: number;

  @Column({ length: 45, nullable: false })
  user_id!: string;

  @Column({ length: 45, nullable: false })
  post_category!: string;

  @Column({ length: 45, nullable: true, default: '제목 없음' })
  post_title!: string;

  @Column({ length: 45, nullable: true, default: '내용 없음' })
  post_content!: string;

  @Column({ length: 45, nullable: true, default: '이미지 없음' })
  post_img!: string;

  @Column({ nullable: true })
  comment_id!: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  delete_flag!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;
}
