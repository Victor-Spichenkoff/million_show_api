import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import { States } from '../types/states';
import { User } from './user.model';
import { Match } from './match.model';
import { Question } from './question.model';

@Entity()
export class Historic {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  finalPrize: number

  @CreateDateColumn()
  finishDate: Date

  @Column()
  finalState: States


  // match id
  @OneToOne(()=> Match)
  @JoinColumn({ referencedColumnName: 'id', name: "match_id" })
  match: Match

  //user id
  @ManyToOne(()=> User, (user) => user.historic)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User

  // many -> questions
  @ManyToMany(()=> Question, (question) => question.historic)
  @JoinColumn({ name: 'question_id', referencedColumnName: "id" })
  questions: Question[]
}
