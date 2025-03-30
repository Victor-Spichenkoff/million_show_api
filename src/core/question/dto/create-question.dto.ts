import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsInt, IsString, MaxLength, MinLength } from "class-validator"

export class CreateQuestionDto {
  @ApiProperty()
  @IsBoolean()
  isBr: boolean = true

  @ApiProperty()
  @IsString()
  @MinLength(5, { message: "Mininum of 5" })
  @MaxLength(100, { message: "Max of 100 characters" })
  label: string

  @ApiProperty()
  @IsString()
  @MinLength(5, { message: "Mininum of 5" })
  @MaxLength(40, { message: "Max of 40 characters" })
  option1: string

  @ApiProperty()
  @IsString()
  @MinLength(5, { message: "Mininum of 5" })
  @MaxLength(40, { message: "Max of 40 characters" })
  option2: string

  @ApiProperty()
  @IsString()
  @MinLength(5, { message: "Mininum of 5" })
  @MaxLength(40, { message: "Max of 40 characters" })
  option3: string

  @ApiProperty()
  @IsString()
  @MinLength(5, { message: "Mininum of 5" })
  @MaxLength(40, { message: "Max of 40 characters" })
  option4: string

  @ApiProperty()
  @IsEnum([1, 2, 3, 4], { message: "Values: 1, 2, 3,4 only" })
  answerIndex: 1 | 2 | 3 | 4
  
  @ApiProperty()
  @IsEnum([1, 2, 3], { message: "Values: 1, 2, 3 only" })
  level: 1 | 2 | 3
}
