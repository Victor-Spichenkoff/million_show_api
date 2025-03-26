import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  isBr: boolean = true

  @Column({ length: 100 })
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
  answerIndex: 1 | 2 | 3 | 4

  @Column()
  level: 1 | 2 | 3
}
