import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { HintState, States } from '../types/states';
import { Historic } from './historic.model';
import { User } from './user.model';
import { QuestionState } from 'types/questionState';

const helpStartCount = 2

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "playing" })
  state: States = "playing"

  // hint
  @Column({ default: "none" })
  hintState: HintState = "none"

  @Column({ default: helpStartCount })
  skips: number = helpStartCount

  @Column({ default: 1 })
  halfHalf: number = 1

  @Column({ default: helpStartCount })
  universitary: number = helpStartCount

  @Column({ default: 0 })
  questionIndex: number = 0

  @CreateDateColumn()
  startDate: number

  @Column({ default: 0 })
  wrongPrize: number = 0

  @Column({ default: 0 })
  stopPrize: number = 0

  @Column({ default: 1_000 })
  nextPrize: number = 1_000


  @Column({ default: "waiting" })
  questionState: QuestionState = "waiting"

  // historic
  @OneToOne(() => Historic, (h) => h.match, { onDelete: "CASCADE" })
  // @JoinColumn({ name: "historic_id" })
  historic: Historic

  @ManyToOne(() => User, (u) => u.matchs, { onDelete: "CASCADE" })
  @JoinColumn()
  user?: User
}
