import { Exclude } from 'class-transformer';
import { Department } from 'src/department/department.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToMany(() => Department, (dept) => dept.article)
  @JoinTable({ name: 'article_department' })
  departments: Department[];

  @ManyToMany(() => User, (user) => user.article)
  @JoinTable({ name: 'article_user' })
  users: User[];

  @Column({ default: false })
  allCanSee: boolean;

  @ManyToOne(() => User, (user) => user.createArticle)
  @JoinColumn({ name: 'userId' })
  createUser: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Exclude()
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Exclude()
  updateTime: Date;
}
