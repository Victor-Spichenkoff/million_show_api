import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, } from '@nestjs/swagger';


export class SignInDto {
  @ApiProperty()
  @IsString()
  userName: string

  @ApiProperty({ example: "1234" })
  @IsString()
  @MinLength(4, {message: 'Password must be at least 4' })
  @MaxLength(12, {message: 'Password must be lower than 12+1 characters' })
  password: string
}
