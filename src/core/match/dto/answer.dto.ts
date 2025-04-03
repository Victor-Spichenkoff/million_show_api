import { IsInt, Max, Min } from "class-validator";
import { AnswerIndex } from "types/indexs";

export class AnswerDto {
    @IsInt()
    @Min(1, { message: "Min is 1" })
    @Max(4, { message: "Max is 4" })
    answerIndex: AnswerIndex
}