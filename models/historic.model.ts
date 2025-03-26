import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { States } from '../types/states';
import { CreateDateColumn } from 'typeorm/browser';

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

  //user id

  // many -> questions
}
