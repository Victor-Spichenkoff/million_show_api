import {IsOptional, IsNumber} from "class-validator";

export class CreatePointDto {
    @IsNumber()
    @IsOptional()
    totalTime: number
}
