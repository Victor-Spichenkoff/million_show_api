import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Historic } from './historic.model';
import { AnswerIndex } from 'types/indexs';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  isBr: boolean = true

  @Column({ length: 100, unique: true })
  label: string

  @Column({ length: 40 })
  option1: string

  @Column({ length: 40 })
  option2: string

  @Column({ length: 40 })
  option3: string

  @Column({ length: 40 })
  option4: string

  @Column()
  answerIndex: AnswerIndex

  @Column()
  level: 1 | 2 | 3


  @ManyToMany(() => Historic, (h) => h.questions, { cascade: true })
  historic: Historic[]
}
