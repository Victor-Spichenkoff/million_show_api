import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsInt, IsString, MaxLength, MinLength } from "class-validator"

export class CreateQuestionDto {
  @ApiProperty()
  @IsBoolean()
  isBr: boolean = true

  @ApiProperty()
  @IsString()
  @MinLength(5, { message: "Label must be at least 5 characters long" })
  @MaxLength(100, { message: "Label can't have more than 100 characters" })
  label: string

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: "Option 1 must have at least 1 character long" })
  @MaxLength(40, { message: "Option 1 can't be more than 40 characters long" })
  option1: string

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: "Option 2 must have at least 1 character long" })
  @MaxLength(40, { message: "Option 2 can't be more than 40 characters long" })
  option2: string

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: "Option 3 must have at least 1 character long" })
  @MaxLength(40, { message: "Option 3 can't be more than 40 characters long" })
  option3: string

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: "Option 4 must have at least 1 character long" })
  @MaxLength(40, { message: "Option 4 can't be more than 40 characters long" })
  option4: string

  @ApiProperty()
  @IsEnum([1, 2, 3, 4], { message: "Invalid question answer index" })
  answerIndex: 1 | 2 | 3 | 4

  @ApiProperty()
  @IsEnum([1, 2, 3], { message: "Invalid level" })
  level: 1 | 2 | 3
}
