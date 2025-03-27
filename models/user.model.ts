import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Historic } from './historic.model';
import { Match } from './match.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string

  @OneToMany(() => Historic, (h) => h.user)
  historic: Historic[]

  @OneToMany(()=> Match, (m) => m.user)
  matchs: Match[]
}
