import { Exclude } from 'class-transformer';
import { Role } from '../role/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsPhoneNumber, Length } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ length: 100 })
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @Column({ length: 20, nullable: true })
  realName: string;

  @Column({ nullable: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsPhoneNumber('CN')
  phone: string;

  @Column({ default: true })
  status: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

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
