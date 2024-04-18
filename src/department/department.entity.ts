import { Exclude } from 'class-transformer';
import { User } from '../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from '../article/article.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 15 })
  name: string;

  @Column()
  avatar: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.department)
  users: User[];

  @ManyToOne(() => User, (user) => user.createDept)
  @JoinColumn()
  createUser: User;

  @ManyToMany(() => Article, (article) => article.departments)
  article: Article[];

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
