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
export class Historic {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: 0 })
  finalPrize: number = 0

  @Column({ default: 0 })
  finishDate: number = 0

  @Column({ nullable: true, default: undefined })
  finalState?: States = undefined

  // match id
  @OneToOne(() => Match, { onDelete: "CASCADE" })
  @JoinColumn({ referencedColumnName: 'id', name: "match_id" })
  match: Match

  //user id
  @ManyToOne(() => User, (user) => user.historic, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User

  // many -> questions
  @ManyToMany(() => Question, (question) => question.historic, )
  @JoinTable()
  // @JoinColumn({ name: 'question_id', referencedColumnName: "id" })
  questions: Question[]
}
