import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { States } from '../types/states';
import { Historic } from './historic.model';
import { User } from './user.model';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: States;

  @Column()
  password: string

  @Column()
  skips: number

  @Column()
  halfHalf: number

  @Column()
  questionIndex: number

  @CreateDateColumn()
  startDate: Date

  @Column()
  wrongPrize: number

  @Column()
  stopPrize: number

  @Column()
  correctPrize: number

  // historic
  @OneToMany(() => Historic, (h) => h.match)
  historic: Historic

  @OneToOne(()=> User, (u) => u.matchs)
  user?: User
}
