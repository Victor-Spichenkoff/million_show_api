import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { States } from '../types/states';
import { User } from './user.model';
import { Match } from './match.model';
import { Question } from './question.model';

@Entity()
export class Point {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: 0 })
  skipsUsed: number = 0

  @Column({ default: 0 })
  univerUsed: number = 0

  @Column({ default: 0 })
  halfUsed: number = 0

  @Column({ default: 0 })
  points: number = 0

  @Column({ default: 0 })
  corrects: number = 0

  @CreateDateColumn()
  finishDate: number = 0

  @Column({ default: 0 })
  totalTime: number = 0

  //user.ts id
  @ManyToOne(() => User, (user) => user.points, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User
}
