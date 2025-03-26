import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { States } from '../types/states';
import { CreateDateColumn } from 'typeorm/browser';

@Entity()
export class User {
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
}
