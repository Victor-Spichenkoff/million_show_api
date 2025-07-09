import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Historic} from "./historic.model";
import {Question} from "./question.model";

@Entity()
export class HistoricQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Historic, (h) => h.historicQuestions, { onDelete: 'CASCADE' })
    historic: Historic;

    @ManyToOne(() => Question, { eager: true, onDelete: 'CASCADE' })
    question: Question;

    @Column()
    orderIndex: number//ensure order
}
