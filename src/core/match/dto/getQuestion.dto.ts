import { Exclude } from "class-transformer";
import { Historic } from "models/historic.model";
import { Match } from "models/match.model";
import { AnswerIndex } from "types/indexs";
import { States } from "types/states";

export class GetQuestionDto {

  id: number
  isBr: boolean
  label: string

  option1: string
  option2: string
  option3: string
  option4: string
  level: 1 | 2 | 3

  @Exclude()
  answerIndex: AnswerIndex
  @Exclude()
  historic: Historic[]

}
