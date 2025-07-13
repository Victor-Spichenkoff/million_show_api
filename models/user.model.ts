import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Historic } from './historic.model';
import { Match } from './match.model'
import {Point} from "./points.model";
import {UserRoles} from "../types/roles";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string

  @Column({default: "normal"})
  role: UserRoles = "normal"

  @OneToMany(() => Historic, (h) => h.user)
  historic: Historic[]

  @OneToMany(()=> Match, (m) => m.user)
  matchs: Match[]

  @OneToMany(()=> Point, (p) => p.user)
  points: Point[]
}
